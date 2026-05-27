import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/authorize";
import { serializeTags } from "@/lib/blog";
import { env } from "@/lib/env";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

type SkipReason = "missing_title" | "missing_slug";

interface SkippedPage {
  pageId: string;
  reason: SkipReason;
  // Best-effort label so the user can identify the offending page in Notion.
  hint?: string;
}

export async function POST(req: NextRequest) {
  const { authorized, session, response } = await requireAdmin(req);
  if (!authorized) return response;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    if (!env.NOTION_INTEGRATION_SECRET || !env.NOTION_CONTENT_CALENDAR_DB_ID) {
      return NextResponse.json(
        { error: "Notion integration is not configured in environment variables." },
        { status: 500 },
      );
    }

    const notion = new Client({ auth: env.NOTION_INTEGRATION_SECRET });
    const n2m = new NotionToMarkdown({ notionClient: notion });

    // Page through results so we don't silently miss anything > 100 rows.
    const allResults: any[] = [];
    let cursor: string | undefined = undefined;
    do {
      const dbResponse: any = await notion.databases.query({
        database_id: env.NOTION_CONTENT_CALENDAR_DB_ID,
        filter: {
          property: "Status",
          select: {
            equals: "published",
          },
        },
        start_cursor: cursor,
        page_size: 100,
      });
      allResults.push(...(dbResponse.results as any[]));
      cursor = dbResponse.has_more ? dbResponse.next_cursor : undefined;
    } while (cursor);

    const totalFromNotion = allResults.length;
    console.log(
      `[notion-sync] query returned ${totalFromNotion} page(s) with Status=published`,
    );

    let syncedCount = 0;
    const skipped: SkippedPage[] = [];
    const errors: string[] = [];

    for (const page of allResults) {
      try {
        const props = page.properties ?? {};

        const title = props.Title?.title?.[0]?.plain_text;
        const slug = props.Slug?.rich_text?.[0]?.plain_text;

        if (!title) {
          console.warn(`[notion-sync] skip ${page.id}: missing Title`);
          skipped.push({ pageId: page.id, reason: "missing_title" });
          continue;
        }
        if (!slug) {
          console.warn(
            `[notion-sync] skip ${page.id} ("${title}"): missing Slug`,
          );
          skipped.push({ pageId: page.id, reason: "missing_slug", hint: title });
          continue;
        }

        const excerpt = props.Excerpt?.rich_text?.[0]?.plain_text || null;
        const status = "published";
        const tags = props.Tags?.multi_select?.map((t: any) => t.name) || [];
        const metaTitle = props["Meta Title"]?.rich_text?.[0]?.plain_text || null;
        const metaDescription =
          props["Meta Description"]?.rich_text?.[0]?.plain_text || null;
        const publishedAtStr = props["Published At"]?.date?.start;

        let coverImage: string | null = null;
        const coverFile = props["Cover Image URL"]?.files?.[0];
        const coverUrl = props["Cover Image URL"]?.url;
        if (coverFile) {
          coverImage =
            coverFile.type === "external"
              ? coverFile.external.url
              : coverFile.file.url;
        } else if (coverUrl) {
          // Cover Image URL column is configured as a `url` property, not `files`.
          coverImage = coverUrl;
        } else if (page.cover) {
          coverImage =
            page.cover.type === "external"
              ? page.cover.external.url
              : page.cover.file.url;
        }

        const publishedAt = publishedAtStr || new Date().toISOString();

        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const content = n2m.toMarkdownString(mdBlocks).parent;

        const postData = {
          title,
          slug,
          content,
          excerpt,
          coverImage,
          status,
          tags: tags.length > 0 ? serializeTags(tags) : null,
          metaTitle,
          metaDescription,
          authorId: "notion-sync",
          publishedAt,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const { error } = await supabaseAdmin
          .from("post")
          .upsert(postData, { onConflict: "slug" });

        if (error) {
          console.error(`[notion-sync] upsert failed for "${slug}":`, error);
          errors.push(`Failed to sync ${slug}: ${error.message}`);
        } else {
          console.log(`[notion-sync] synced "${slug}"`);
          syncedCount++;
        }
      } catch (err: any) {
        console.error(`[notion-sync] error on page ${page.id}:`, err);
        errors.push(`Error processing page ${page.id}: ${err.message}`);
      }
    }

    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    revalidatePath("/feed.xml");

    console.log(
      `[notion-sync] done — synced=${syncedCount} skipped=${skipped.length} errors=${errors.length} total=${totalFromNotion}`,
    );

    return NextResponse.json({
      success: true,
      syncedCount,
      totalFromNotion,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("[notion-sync] fatal error:", error);
    return NextResponse.json(
      { error: "Failed to sync with Notion", details: error.message },
      { status: 500 },
    );
  }
}

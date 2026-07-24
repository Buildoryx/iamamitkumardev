import { SITE_URL } from "./site";

/**
 * IndexNow — instant index/crawl ping for Bing, Yandex, Seznam, Naver, etc.
 *
 * Google does NOT use IndexNow, but Bing's index feeds ChatGPT and Copilot, so
 * this directly supports AEO (getting cited by AI answer engines). For Google,
 * rely on Search Console "Request Indexing" + crawl demand from external links.
 *
 * The key is a plain token hosted at https://<host>/<key>.txt (see /public).
 * Override via the INDEXNOW_KEY env var if you rotate it.
 */
const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "3f9a1e7c5b2d48e6a0c9f4b8d1e6a2c7";

const HOST = new URL(SITE_URL).host;

/**
 * Fire-and-forget IndexNow submission. Never throws — an indexing ping must
 * never break the publish flow. Accepts absolute paths ("/blog/my-post") or
 * full URLs.
 */
export async function submitToIndexNow(paths: string[]): Promise<void> {
  try {
    const urlList = Array.from(new Set(paths))
      .filter(Boolean)
      .map((p) =>
        p.startsWith("http")
          ? p
          : `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`,
      );
    if (urlList.length === 0) return;

    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
  } catch {
    // Best-effort only — swallow network/errors.
  }
}

export { INDEXNOW_KEY };

import type { Metadata } from "next";
import { getTweet } from "react-tweet/api";
import { MinimalTweetCard } from "@/components/minimal-tweet-card";
import { Subheading } from "@/components/subheading";
import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";

export const metadata: Metadata = {
  title: "Tweets — Build-in-Public Posts & Updates",
  description:
    "A curated timeline of my build-in-public posts on products, launches, growth, and indie hacker execution.",
  alternates: {
    canonical: "/tweets",
  },
  openGraph: {
    title: "Tweets — Build-in-Public Posts & Updates",
    description:
      "A curated timeline of my build-in-public posts on products, launches, growth, and indie hacker execution.",
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tweets — Build-in-Public Posts & Updates",
    description:
      "A curated timeline of my build-in-public posts on products, launches, growth, and indie hacker execution.",
    images: ["/images/og-image.png"],
  },
};

const tweetUrls = [
  "https://x.com/growthperclick/status/2043874498605396381",
  "https://x.com/growthperclick/status/2043661871627325616",
  "https://x.com/growthperclick/status/2043658647990043135",
  "https://x.com/growthperclick/status/2043599411260084620",
  "https://x.com/growthperclick/status/2043213699486515281",
  "https://x.com/growthperclick/status/2043069727573184770",
  "https://x.com/growthperclick/status/2042850380304814478",
  "https://x.com/growthperclick/status/2042839367467831530",
  "https://x.com/growthperclick/status/2041628963827806275",
  "https://x.com/growthperclick/status/2041622992875385045",
  "https://x.com/growthperclick/status/2041024853692797351",
  "https://x.com/growthperclick/status/2040931991986819117",
  "https://x.com/growthperclick/status/2040870332429676944",
  "https://x.com/growthperclick/status/2034594757205491745",
  "https://x.com/growthperclick/status/2031935159738769646",
  "https://x.com/growthperclick/status/2031758278187995445",
  "https://x.com/growthperclick/status/2031645520331169926",
] as const;

function getTweetId(url: string) {
  return url.split("/status/")[1]?.split("?")[0] ?? "";
}

// Re-fetch tweets every 24 hours instead of only at build time. This
// stops a transient X / syndication-API failure from breaking deploys.
export const revalidate = 86_400;

/**
 * The X syndication API frequently returns `entities` with only a `media`
 * key, omitting `hashtags`, `user_mentions`, `urls`, and `symbols`.
 * react-tweet's enrichTweet() -> getEntities() -> addEntities() does
 * `for (const entity of entities)` on each of those arrays, so a missing
 * key throws "entities is not iterable" and the whole card renders nothing.
 * Backfill the arrays so enrichTweet() always succeeds.
 */
function normalizeTweetEntities<T extends { entities?: unknown }>(tweet: T): T {
  const e = (tweet.entities ?? {}) as Record<string, unknown>;
  return {
    ...tweet,
    entities: {
      hashtags: e.hashtags ?? [],
      user_mentions: e.user_mentions ?? [],
      urls: e.urls ?? [],
      symbols: e.symbols ?? [],
      ...(e.media ? { media: e.media } : {}),
    },
  };
}

async function safeGetTweet(id: string) {
  if (!id) return null;
  try {
    const tweet = await getTweet(id);
    // Reject tweets that don't have the minimum viable shape — a missing
    // user or missing id_str means react-tweet's enrichTweet() will throw
    // when it tries to render. Better to drop the card than fail the build.
    if (!tweet?.user || !tweet?.id_str) return null;
    return normalizeTweetEntities(tweet);
  } catch (error) {
    // Log on the server, drop the tweet silently in the UI. We never want
    // a single deleted / protected / rate-limited tweet to fail the page.
    console.warn(`[tweets] getTweet(${id}) failed:`, error);
    return null;
  }
}

export default async function TweetsPage() {
  const items = await Promise.all(
    tweetUrls.map(async (url) => {
      const id = getTweetId(url);
      const tweet = await safeGetTweet(id);
      return { url, id, tweet };
    }),
  );

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <Container>
        <h1 className="sr-only">
          Tweets — Build-in-Public Posts and Updates by Amit Kumar
        </h1>
        <Subheading>I post on twitter, you know.</Subheading>
        <p className="text-foreground pt-4 text-base text-balance">
          Most posts are build-in-public updates: what I shipped, what failed,
          and what moved users and revenue.
        </p>
        <p className="text-foreground pt-4 text-base">
          Here are selected posts from my founder/operator journey.
        </p>
      </Container>

      <div className="mt-8 mb-20 w-full columns-1 gap-x-4 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5">
        {items.map(({ url, tweet }) =>
          tweet ? (
            <MinimalTweetCard key={tweet.id_str} tweet={tweet} href={url} />
          ) : null,
        )}
      </div>
      <Container>
        <DottedSeparator className="my-8" />
      </Container>
    </div>
  );
}

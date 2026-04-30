import {
  IconArrowUpRight,
  IconMailBolt,
  IconSparkles,
} from "@tabler/icons-react";
import { Box } from "@/components/box";
import { Subheading } from "@/components/subheading";
import { SUBSTACK_SUBSCRIBE_URL } from "@/lib/site";

export function NewsletterCTA() {
  return (
    <section className="border-border bg-card/60 relative overflow-hidden rounded-lg border p-4 shadow-sm sm:p-5">
      <div className="via-foreground/15 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent" />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <Box className="mt-0.5 shrink-0 bg-linear-to-b from-orange-400 to-rose-500 ring-offset-orange-500">
            <IconMailBolt className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
          </Box>

          <div className="min-w-0">
            <Subheading>Read on Substack</Subheading>
            <h3 className="text-foreground mt-2 text-lg leading-snug font-semibold tracking-tight">
              Get the next build note before it becomes a blog post.
            </h3>
            <p className="text-foreground/65 mt-2 text-sm leading-6">
              Founder notes, product experiments, and practical AI systems
              breakdowns from the workbench.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Build logs", "AI agents", "Growth systems"].map((item) => (
                <span
                  key={item}
                  className="border-border bg-background/70 text-foreground/55 inline-flex items-center gap-1 rounded-sm border px-2 py-1 font-mono text-[10px] tracking-widest uppercase"
                >
                  <IconSparkles className="size-3" aria-hidden />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <a
          href={SUBSTACK_SUBSCRIBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Subscribe on Substack"
          className="bg-primary text-primary-foreground ring-primary/10 hover:bg-primary/90 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium shadow-sm ring-1 transition-colors sm:w-auto"
        >
          Subscribe on Substack
          <IconArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
    </section>
  );
}

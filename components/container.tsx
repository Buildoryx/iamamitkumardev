import { cn } from "@/lib/utils";

export default function Container({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Was max-w-2xl (672px), which rendered as a 47%-wide strip on a
        // 1440px viewport with ~384px of dead margin either side — a large
        // part of why the site read as "boxed". 768px keeps line length in
        // comfortable reading range while filling more of the viewport.
        "mx-auto w-full min-w-0 max-w-3xl px-4 sm:px-6",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

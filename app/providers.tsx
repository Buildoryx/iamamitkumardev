"use client";

import { ThemeProvider } from "next-themes";

// The site has two theme systems: next-themes (light/dark via the `.dark`
// class) and the in-page Settings panel (font + color theme via CSS vars).
// The Settings panel only ships light color themes (Paper, Bloom, Lagoon,
// Nocturne, Honey, Lilac — all *-50 backgrounds), and there is no
// visitor-facing dark-mode toggle. With next-themes defaulting to
// `system`, visitors with OS dark mode get the .dark class added to
// <html>, which redefines `--background` and `--card` to near-black —
// while `--theme-bg` (used by <body>) stays light. The result is a
// white page with black form inputs.
//
// Force the light theme until we ship a real dark-mode pass.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
    >
      {children}
    </ThemeProvider>
  );
}

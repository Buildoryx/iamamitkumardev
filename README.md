# iamamitkumar.dev

Amit Kumar's personal website and blog. Built with Next.js, Tailwind CSS v4, and MDX.

## Overview

- `app/blog/*` - Blog posts rendered using MDX
- `app/tweets` - Curated [tweets](https://iamamitkumar.dev/tweets)
- `app/inspiration` - Design [inspiration](https://iamamitkumar.dev/inspiration)
- `app/sponsor` - [Sponsor](https://iamamitkumar.dev/sponsor) page
- `components/*` - Reusable UI components

## Getting Started

```bash
git clone https://github.com/Rexiumit/mypersonalportfolio.git
cd mypersonalportfolio
npm install
npm run dev
```

Production site: **https://iamamitkumar.dev**. The dev server runs on [http://localhost:3000](http://localhost:3000) using Turbopack. Set `NEXT_PUBLIC_APP_URL=https://iamamitkumar.dev` on Vercel for canonical URLs and analytics.

## Built With

- [Next.js 16](https://nextjs.org) (App Router)
- [Turbopack](https://turbo.build/pack)
- [Tailwind CSS v4](https://tailwindcss.com)
- [MDX](https://mdxjs.com) via next-mdx-remote
- [Motion](https://motion.dev) (Framer Motion)
- [Vercel](https://vercel.com)

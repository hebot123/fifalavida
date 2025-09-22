# FIFA La Vida

Welcome to **FIFA La Vida**, a fan‑run hub for FIFA moments, NFTs and football culture. This repository contains the source code for the website `fifalavida.com`, built with Next.js, Tailwind CSS and MDX.

> **Important:** This project is not affiliated with FIFA or any official organisation. The content herein is for informational and educational purposes only.

## Features

* **Home page** with a hero section, referral call‑to‑action, live news updates ticker, featured blog posts and an Instagram embed.
* **Blog** section powered by MDX. Posts live under `content/posts`. Categories include FIFA Collect, NBA Top Shot, NFT Basics, Guides and Market Watch.
* **Automated news fetcher**. A serverless API route (`/api/updates`) aggregates RSS feeds from FIFA and other sources. The response is cached for four hours.
* **Newsletter signup** form (placeholder). Integrate with your preferred provider (e.g. Beehiiv, Mailchimp or Buttondown).
* **SEO** friendly with sensible defaults. Adjust meta tags and descriptions per page or post as needed.
* **Responsive design** via Tailwind CSS.

## Getting Started

These instructions assume you have Node.js installed. Clone the repository and install dependencies:

```bash
cd fifalavida
npm install
```

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site in your browser. The page will auto‑reload as you edit files.

### Adding Blog Posts

Blog posts live in the `content/posts` directory as `.mdx` files. Each file must include front‑matter at the top:

```mdx
---
title: "Post Title"
date: "2025-09-22"
description: "A short summary of the post."
category: "FIFA Collect"
---

Your markdown/MDX content goes here. You can embed JSX components from `app/components` as needed.
```

The `lib/posts.ts` helper reads these files, extracts metadata using `gray-matter`, and sorts them by date. To add a new post, simply create an `.mdx` file with the required front‑matter. During development, restart the dev server or refresh the page to see the new post.

### Updating the News Feed

The `/api/updates` endpoint fetches news items from a list of RSS feeds defined in `lib/updates.ts`. It uses `rss-parser` to parse feed data. Results are cached in memory for four hours to reduce external requests.

To add or remove sources, edit the `FEEDS` array in `lib/updates.ts`. Each entry requires a `url` and `source` label. After editing, deploy the update to regenerate the news feed.

#### Cron Job for Refreshing Updates

On Vercel, you can configure a scheduled function (Cron Job) to ping `/api/updates` at a regular interval to warm the cache and rebuild static pages. For example, in the Vercel dashboard under **Deployments → Cron Jobs**, create a job with the following settings:

* **Target URL:** `https://fifalavida.com/api/updates`
* **Frequency:** Every 4 hours (e.g. `*/4 * * *` in Vercel’s cron syntax)

This ensures that `ISR` pages such as `/updates` are regenerated and serve fresh content.

### Configuring the Newsletter

The `NewsletterCTA` component in `app/components` is currently a placeholder. To integrate a real provider:

1. Choose a service (e.g. [Beehiiv](https://www.beehiiv.com), [Mailchimp](https://mailchimp.com) or [Buttondown](https://buttondown.email)).
2. Obtain an embed form or API endpoint.
3. Replace the form submission handler in `NewsletterCTA.tsx` with your integration logic.

### Deploying to Production

1. **Repository:** Push this code to GitHub or another Git hosting provider.
2. **Vercel:** Import the repository on [Vercel](https://vercel.com) and set the root directory to `fifalavida`. Vercel automatically detects Next.js and tailwind configurations.
3. **Environment Variables:** If you add environment variables (e.g. analytics keys), define them in Vercel’s project settings.
4. **Domain:** Point the custom domain `fifalavida.com` to your Vercel deployment via the domain settings.

Once deployed, your site will automatically rebuild when you push new commits. Scheduled cron jobs keep the news feed fresh.

## Content Calendar

See the `content-calendar.md` in the repository root for a detailed publishing schedule through June 2026.

## License

This project is released under the MIT License. See `LICENSE` for details.
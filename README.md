This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Structured Logging

This app writes lightweight JSON logs to the browser console and server console for pilot debugging.

Set these environment variables locally or in Heroku:

```bash
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_SENTRY_DSN=your_frontend_dsn_here
SENTRY_DSN=your_frontend_dsn_here
SENTRY_AUTH_TOKEN=your_source_map_token
SENTRY_ORG=your_org_slug
SENTRY_PROJECT=your_project_slug
```

What gets logged:

- login, logout, and account activation
- failed dog moves, walks, notes, and other shelter actions
- admin user and location changes
- request IDs when the backend returns them

Keep the log level at `info` in production and bump to `debug` only when you need deeper troubleshooting.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

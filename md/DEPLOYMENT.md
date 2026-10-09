# Deploy protein.wiki

Public app: https://protein.wiki

protein.wiki is a static Vite application. Cloudflare Workers Static Assets serves the built files directly; no Worker script or server is needed.

## Publish from your machine

```sh
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm deploy
```

If pnpm is not on your shell PATH after dependencies have been installed, sign in with `node node_modules/wrangler/bin/wrangler.js login`.

The checked-in configuration retains the existing Worker identity, binds `protein.wiki` as a Custom Domain, and uploads only `dist/`. Wrangler prints the deployed URL. No credentials belong in source control.

## Continuous deployment

GitHub Actions runs the build and coordinate recovery checks. For automatic publication, connect this GitHub repository to the existing Cloudflare Worker under **Settings → Builds**. Use `pnpm build` as the build command and `pnpm exec wrangler deploy` as the deploy command, with Node.js 24. A Cloudflare Git integration avoids storing an API token in the repository or local files.

## Domain and analytics

`protein.wiki` is the primary domain. Wrangler manages its Custom Domain binding, and Cloudflare manages DNS and TLS certificates. If the primary domain changes, update the canonical, Open Graph and Twitter image URLs in index.html and the live link in README.md.

Cloudflare Web Analytics can be added separately with its public beacon token. The app does not currently load an analytics beacon. Standard page-view and performance metrics are sufficient; molecular searches and picked atoms do not need custom tracking.

## Other static hosts

Vercel can build this project with `pnpm build` and serve `dist`. GitHub Pages also supports it, but a repository-path deployment additionally requires Vite's base path and the runtime URLs for bundled coordinates/thumbnails to use that prefix. Root-domain deployment avoids that change.

Official references: [static assets](https://developers.cloudflare.com/workers/static-assets/), [limits and billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/), [Web Analytics](https://developers.cloudflare.com/web-analytics/).

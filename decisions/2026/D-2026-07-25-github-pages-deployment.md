# D-2026-07-25-github-pages-deployment · GitHub Pages, base-path asset-URL fix, deploy gated behind full check

Date: 2026-07-25
Status: Implemented

- **Context:** The user asked their daughter to be able to play the game on a phone/tablet/laptop. Until
  now the app only existed as source, run via `npm run dev` — no public URL anywhere (flagged as a known
  gap on `docs/TASK_BOARD.md`'s SOMEDAY list since 2026-07-20).
- **Options for hosting:** GitHub Pages (free, no new account, repo already here) vs. Vercel/Netlify
  (also free tiers, nicer preview-deploy UX, but a new account/service to connect and maintain) vs. a
  custom domain (unnecessary cost/complexity for a hobby project).
- **Decision:** GitHub Pages, deployed via `.github/workflows/deploy.yml` on push to `main`
  (`actions/upload-pages-artifact` + `actions/deploy-pages`, the modern Actions-based flow, not the
  legacy `gh-pages` branch approach).
- **Why:** the app is 100% client-side — all save state is `localStorage` only, no backend, no API keys,
  nothing Vercel/Netlify's extra features would actually be used for. GitHub Pages is the zero-setup
  option given the repo's already on GitHub, and this was explicitly framed as "let a kid try the game,"
  not a project needing preview deployments per PR.
- **A real bug this surfaced:** GitHub Pages serves a project repo at `https://<owner>.github.io/
  wildlife-explorer/`, not the domain root, so `vite.config.ts` needs `base: '/wildlife-explorer/'`. Every
  hardcoded `<img src="/assets/...">` and the two URL-building functions in `animalPhotoVariants.ts` were
  writing root-relative paths that would have 404'd once deployed (they worked fine locally, since dev's
  default base is `/`, which is exactly the kind of bug that's invisible until you actually deploy).
  Fixed by adding `src/assetUrl.ts` — a single helper that prefixes `import.meta.env.BASE_URL` — and
  routing every asset reference through it instead of a raw string literal.
- **A side effect worth knowing:** `base` also changes the **dev server's** URL, not just the production
  build — `npm run dev` now serves at `http://localhost:<port>/wildlife-explorer/`. Vite prints the exact
  URL; noted in `AI.md`'s Verification section so it's not surprising.
- **Verification:** this wasn't just "add the config and hope" — built the real production bundle, served
  `dist/` under the actual subpath with `vite preview`, `curl`'d every image asset (hero images, an
  animal photo variant, the favicon) and got 200s, then confirmed the *old* un-prefixed path 404s
  (proving the fix was necessary, not just harmless). Then did a full real-browser walkthrough
  (Playwright) watching for any failed network request — zero. The deploy workflow itself runs the full
  `npm run check` (not just a build) before uploading the Pages artifact, so a broken build/test/typecheck
  can never reach the live site.
- **Status:** Implemented. Required one manual step outside git's reach (GitHub repo Settings → Pages →
  Source → "GitHub Actions", a one-time UI toggle) plus one follow-up fix: the very first workflow run
  failed at `actions/configure-pages` with `HttpError: Not Found` on `GET /repos/{owner}/{repo}/pages` —
  a known chicken-and-egg problem where that action reads the Pages site config via the API, which 404s
  until something has explicitly created it. Fixed by passing `enablement: true` to
  `actions/configure-pages@v5`, which tells it to enable Pages itself instead of just failing.

# eum-play Work Log

Every model must read this file before edits and append entries before and after work.

## Baseline: 2026-05-26 KST Pre-Deploy Check

Current state: React/Vite/GitHub Pages app. Local build and lint pass through bundled Node.

Release readiness: blocked.

Known blockers:

- Footer URL generation can call `new URL("")` for shared app entries without live URLs and crash the home screen.
- GitHub Pages base is `/eum-play/`, but some public assets are linked from root paths.
- ErrorBoundary home button navigates to `/` instead of the app base path.
- Working tree has uncommitted README/package/footer/family-data changes.

Verification baseline:

- Vite build passed.
- ESLint passed.
- Normal `npm` command unavailable in PATH; bundled Node was used for verification.

Next action:

- Fix footer no-URL guard first.
- Fix GitHub Pages asset paths and ErrorBoundary home route.
- Review package-lock/package changes before commit.

## Entry Template

### Before Work: 2026-05-26 16:39 KST

- Current state: React/Vite/GitHub Pages app selected for second detailed remediation pass after `eum-camp`.
- Dirty git state: `M README.md`, `M package-lock.json`, `M package.json`, `M src/components/EumFamilyFooter.jsx`, `M src/data/eumFamily.js`, `?? WORK_LOG.md`.
- Blockers: GitHub Pages public asset links use root paths, ErrorBoundary home button navigates to `/`, shared footer sync changes need verification, package/package-lock changes need review.
- Verification baseline: previous bundled-Node Vite build and ESLint passed.
- Intended scope: fix Pages path blockers and verify the synced footer; do not revert existing package/readme changes unless they block the app.

### After Work: 2026-05-26 16:44 KST

- Changed files: `index.html`, `src/components/ErrorBoundary.jsx`, `WORK_LOG.md`; verified existing generated changes in `src/components/EumFamilyFooter.jsx` and `src/data/eumFamily.js`.
- Summary: changed root public asset links to `/eum-play/eum-logo.png` and `/eum-play/manifest.webmanifest`; changed ErrorBoundary home navigation to `import.meta.env.BASE_URL`; confirmed shared footer no-URL guard is present.
- Verification: bundled Node ESLint passed; Vite production build passed; built `dist/index.html` contains `/eum-play/...` asset links; local preview at `/eum-play/` returned HTTP 200; manifest URL returned HTTP 200.
- Remaining risks: existing uncommitted `README.md`, `package.json`, and large `package-lock.json` changes remain and should be reviewed before commit; no automated test script exists; normal `npm`/`npx` still unavailable in PATH so `npm audit` was not run.
- Next action: if release continues, review and either accept or intentionally separate the package/README cleanup, then run GitHub Pages workflow or push only after explicit approval.

### Before Work: 2026-05-29 12:05 KST

- Current state: React/Vite/GitHub Pages app; favicon currently points at shared `eum-logo.png` and manifest uses `favicon.svg`.
- Dirty git state: pre-existing modified README, index, package files, ErrorBoundary, footer, family data, plus untracked WORK_LOG.
- Blockers: unrelated dirty changes remain; deployment by push would include more than this favicon work unless scoped carefully.
- Verification baseline: prior ESLint/build passed through bundled Node.
- Intended scope: add a new E:UM Play browser icon, update favicon/manifest references, build locally, and avoid reverting unrelated changes.

### After Work: 2026-05-29 12:25 KST

- Changed files: `index.html`, `public/manifest.webmanifest`, `public/app-icon.png`, `WORK_LOG.md`.
- Summary: added the new E:UM Play PNG app icon, pointed favicon/apple-touch to `/eum-play/app-icon.png`, and updated the PWA manifest icon to the PNG asset.
- Verification: bundled Node Vite build passed; built `dist/index.html` and `dist/manifest.webmanifest` reference `app-icon.png`; `dist/app-icon.png` exists.
- Remaining risks: pre-existing dirty package/readme/footer changes remain; GitHub Pages deployment was not pushed because `gh` is unauthenticated and commit-based deployment would need a clean scoped commit.
- Next action: review/commit intended changes only and push `main` from an authenticated GitHub environment.

### Remote Deploy Attempt: 2026-05-29 12:45 KST

- Created clean deploy worktree: `D:\Projects\Web\_deploy-worktrees\eum-play-icon`.
- Created icon-only commit: `193433f Update browser app icon`.
- Push result: blocked. HTTPS push requires GitHub credentials not present on this machine.
- Connector result: blocked. GitHub connector write permissions returned 403.
- Next action: from an authenticated GitHub shell, run `git push origin 193433f:main` inside the deploy worktree to trigger the existing GitHub Pages workflow.

### Remote Deploy Completed: 2026-05-29 13:20 KST

- Pushed `193433f` to `origin/main` after GitHub CLI authentication.
- GitHub Pages workflow `26617503122` completed successfully.
- Live verification: `https://lgh5440.github.io/eum-play/` and `manifest.webmanifest` reference `app-icon.png`; `https://lgh5440.github.io/eum-play/app-icon.png` returns HTTP 200.

### Before Work: YYYY-MM-DD HH:mm KST

- Current state:
- Dirty git state:
- Blockers:
- Verification baseline:
- Intended scope:

### After Work: YYYY-MM-DD HH:mm KST

- Changed files:
- Summary:
- Verification:
- Remaining risks:
- Next action:

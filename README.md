# second-framework-vue

Vue **3** + **TypeScript** + **Vite** SPA with **Vitest** (unit + coverage), **Playwright** (e2e), **ESLint** + **Prettier**, **Docker** (nginx), **SonarCloud**, and a **GitHub Actions QA** workflow.

## Requirements

- **Node.js 22+** (see `engines` in `package.json`)
- **npm** (lockfile committed)

## Quick start

```bash
npm ci
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

## Multiverse Catalog (Rick & Morty)

Phase 1 adds the **Characters** experience backed by the public [Rick and Morty API](https://rickandmortyapi.com/documentation) (`GET https://rickandmortyapi.com/api/character` with `page`, `name`, and `species` filters). **Phase 2** adds **`/character/:id`**: portrait, name, species, status, last known location, first TV appearance (minimum episode id + `GET /api/episode/:id`), and add/remove **favourites** from the grid or dossier. Cards link into the dossier. **Phase 3** adds **`/favorites`**: a simple grid of favorited cards (no filters, no pagination); each card’s display fields are persisted in **`localStorage`** (`rm-favorite-characters`). If nothing is saved, the page shows **“no cards”**. Route-level behaviour lives in **`src/composables/`** (catalog, dossier, favourites list); shared bookmark state stays in **Pinia** (`useFavorites` composable wraps the store for UI).

## Scripts

| Script                  | Description                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `npm run dev`           | Vite dev server                                                                                |
| `npm run build`         | Typecheck + production build to `dist/`                                                        |
| `npm run preview`       | Preview production build                                                                       |
| `npm run lint`          | ESLint                                                                                         |
| `npm run format`        | Prettier write                                                                                 |
| `npm run format:check`  | Prettier check                                                                                 |
| `npm run typecheck`     | `vue-tsc` project references                                                                   |
| `npm run test`          | Vitest (single run)                                                                            |
| `npm run test:watch`    | Vitest watch                                                                                   |
| `npm run test:coverage` | Vitest + V8 coverage + `coverage/lcov.info`                                                    |
| `npm run test:e2e`      | Playwright (`vite preview`; locally runs **`npm run build`** first so `dist/` matches sources) |
| `npm run test:e2e:ui`   | Playwright UI                                                                                  |

## Docker

Build and run the static site (nginx + SPA fallback):

```bash
docker compose up --build
```

Then open `http://localhost:8080`.

Multi-stage `Dockerfile`: Node installs dependencies and builds; nginx serves `dist/`.

## GitHub Pages (demo branch)

Pushes to the **`demo`** branch build the SPA with base path `/<repository-name>/` and deploy via **GitHub Actions** (workflow [`.github/workflows/deploy-pages-demo.yml`](.github/workflows/deploy-pages-demo.yml)).

1. In the repository: **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions** (not “Deploy from a branch”).
2. Merge or push the workflow + Vite base changes to **`demo`** (or open a PR into `demo` and merge). The workflow runs on every push to `demo`.
3. After a successful run, the site is available at  
   `https://<owner>.github.io/<repository-name>/`  
   (for example `https://skluba.github.io/second-framework-vue/`).

**Local check** with the same base path as production:

```bash
VITE_BASE_URL=/second-framework-vue/ npm run build && npm run preview
```

(Replace `second-framework-vue` with your repo name if different.)

### Troubleshooting: blank page and `GET …/src/main.ts` 404

That request means the browser loaded the **development** `index.html` from the repo root (it still points at `/src/main.ts`). A real `npm run build` output never contains `src/main.ts` — it only has hashed files under `/<repo>/assets/`.

**Fix**

1. **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**, not **Deploy from a branch**. If a branch/folder is selected, GitHub serves raw repository files and you get the wrong `index.html`.
2. Open the **project** URL including the repository name, e.g. `https://skluba.github.io/second-framework-vue/` — not `https://skluba.github.io/` (that origin has no `/second-framework-vue/` prefix, so even correct asset paths would break).
3. Under **Actions**, confirm **“Deploy GitHub Pages (demo)”** completed successfully after your last push to **`demo`**.

## SonarCloud

Configured for organization **`skluba`** and host **`https://sonarcloud.io`** (see `sonar-project.properties`).

1. In SonarCloud, create a project with key **`skluba_second-framework-vue`** (or change `sonar.projectKey` to match your SonarCloud project).
2. Import the GitHub repository or link the project so analysis runs on each pipeline.
3. In GitHub: **Settings → Secrets and variables → Actions**, add **`SONAR_TOKEN`** from SonarCloud (**My Account → Security** or project analysis token).

Coverage is uploaded from **`coverage/lcov.info`** (Vitest + `@vitest/coverage-v8`). Entry `src/main.ts` and `src/vite-env.d.ts` are excluded from coverage thresholds as bootstrap/ambient files.

For IDE analysis, SonarLint can use `.sonarlint/connectedMode.json` after you bind a SonarCloud connection in the SonarLint extension.

## GitHub Actions

Workflow: `.github/workflows/qa.yml` (on `push` / `pull_request` to `main` or `master`).

Steps (in order):

1. Checkout (**full history** for Sonar branch analysis)
2. **Node 22** + npm cache + **`npm ci`**
3. **`npm audit --audit-level=high`**
4. **Lint** (`eslint`)
5. **Format check** (`prettier --check`)
6. **Typecheck** (`vue-tsc`)
7. **Unit tests + coverage** (Vitest → `coverage/lcov.info`)
8. **Production build**
9. **Playwright** (Chromium + system deps on Ubuntu)
10. **Artifacts**: `coverage/lcov.info` on every run; Playwright HTML report on failure
11. **SonarCloud Scan** (`SonarSource/sonarqube-scan-action@v5`) with **`SONAR_TOKEN`** — skipped for PRs from forks (GitHub does not expose secrets to fork workflows)

Ensure the default branch name in the workflow matches your repository (`main` vs `master`).

## Project layout

```text
e2e/                 Playwright specs
src/                 Application + Vitest specs (`*.spec.ts`)
src/composables/     Vue composables (catalog, dossier, favourites)
nginx/               SPA nginx config for Docker
.github/workflows/   CI
```

## Git

Initialize locally (already done if `.git` exists):

```bash
git init
git add .
git commit -m "Initial commit"
```

Replace the commit message with whatever matches your team conventions.

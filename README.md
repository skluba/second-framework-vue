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

Phase 1 adds the **Characters** experience backed by the public [Rick and Morty API](https://rickandmortyapi.com/documentation) (`GET https://rickandmortyapi.com/api/character` with `page`, `name`, and `species` filters). The header links to placeholder routes for **Character** (Phase 2) and **Favorites** (Phase 3); favorites chosen on cards persist in `localStorage`.

## Scripts

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `npm run dev`           | Vite dev server                                  |
| `npm run build`         | Typecheck + production build to `dist/`          |
| `npm run preview`       | Preview production build                         |
| `npm run lint`          | ESLint                                           |
| `npm run format`        | Prettier write                                   |
| `npm run format:check`  | Prettier check                                   |
| `npm run typecheck`     | `vue-tsc` project references                     |
| `npm run test`          | Vitest (single run)                              |
| `npm run test:watch`    | Vitest watch                                     |
| `npm run test:coverage` | Vitest + V8 coverage + `coverage/lcov.info`      |
| `npm run test:e2e`      | Playwright (starts `vite preview` automatically) |
| `npm run test:e2e:ui`   | Playwright UI                                    |

## Docker

Build and run the static site (nginx + SPA fallback):

```bash
docker compose up --build
```

Then open `http://localhost:8080`.

Multi-stage `Dockerfile`: Node installs dependencies and builds; nginx serves `dist/`.

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

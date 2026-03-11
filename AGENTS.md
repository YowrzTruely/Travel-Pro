# AGENTS.md

## Learned User Preferences

## Learned Workspace Facts

- When login fails with `InvalidSecret`, run `bun run seed:auth` to reset test user passwords
- For Vercel deployment: ensure only `bun.lock` exists; remove stale `pnpm-lock.yaml` and `package-lock.json`
- Commit `convex/_generated` to git so Vercel build can resolve Convex imports without `CONVEX_DEPLOY_KEY`
- QA tests run via `bunx playwright test e2e/admin-qa-2.1-2.2.spec.ts`; app expects port 5174 when dev server is reused
- Add `!test-results` to biome `files.includes` so Playwright output is excluded from checks

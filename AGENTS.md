# Agent and Coding Rules

These rules apply to AI coding agents and human contributors working from this skeleton.

## Runtime and framework

- Use Bun as the package manager and production runtime.
- Keep the Bun version pinned through `packageManager`, CI, and Docker.
- This is SvelteKit 3. Do not add `svelte.config.js`.
- Put SvelteKit configuration in the `sveltekit(...)` call in `vite.config.ts`.
- Use Svelte 5 runes for new component state.
- Use `$app/state`, not removed legacy stores.
- Use the new `$app/env/private` and `$app/env/public` modules, not deprecated `$env/*` modules.
- Use `#lib` package imports where shared code benefits from them. Do not reintroduce the removed implicit `$lib` alias.

## Backend boundary

- Treat the Bun API as the owner of domain logic, persistence, queues, storage, and integrations.
- Do not duplicate backend business rules in SvelteKit merely for convenience.
- Browser-safe transport code belongs in `src/lib/api`.
- Privileged/server-only integration belongs in `src/lib/server` or another `server` path segment.
- Use `backendApi` for normal server-to-Bun JSON calls so timeout, request ID, and error handling stay consistent.
- Do not import `$app/env/private` from browser-reachable modules.

## Authentication and secrets

- Never store access tokens, refresh tokens, JWTs, passwords, or API keys in `localStorage` or `sessionStorage`.
- Prefer HttpOnly/Secure/SameSite cookies or an equivalent backend-controlled session.
- Never expose private environment variables to client code.
- Never log credentials, cookies, bearer tokens, full sensitive request bodies, or secret environment values.
- Do not weaken CSP, CSRF, CORS, or response headers merely to make an integration pass locally. Fix the integration boundary instead.

## TypeScript

- Keep strict TypeScript enabled.
- Avoid `any`; use `unknown` at untrusted boundaries and narrow it.
- Keep stable API/domain response types explicit.
- Treat network, storage, URL params, form data, and environment inputs as untrusted until validated.

## Svelte

- Keep components focused on presentation and interaction.
- Prefer route `load`/actions for route-owned data over global client fetching during mount.
- Preserve progressive enhancement where practical.
- Keep accessibility semantics intact: labels, button types, keyboard focus, headings, and meaningful link text.
- Do not disable Svelte accessibility warnings without a documented reason.

## API calls

- Use stable backend error `code` values for application branching when available.
- Preserve and propagate `x-request-id` through server-side calls.
- Always apply a timeout to upstream network requests.
- Do not silently retry mutations. Retries require endpoint-specific idempotency semantics.
- Do not forward auth headers/cookies to arbitrary third-party origins.

## Dependencies

- Keep the starter dependency surface small.
- Do not add a UI kit, form library, state manager, auth SDK, analytics SDK, schema library, or icon pack to the skeleton unless it is broadly justified for derived projects.
- Pin direct dependency versions in the skeleton and commit `bun.lock`.
- Prefer platform/SvelteKit primitives over tiny convenience packages.

## Quality gate

Before merging a functional change, run:

```bash
bun run check
bun run lint
bun run format:check
bun run test:unit
bun run --bun build
```

Run Playwright when behavior visible in the browser changed.

## Documentation

- Update `.env.example` when environment variables change.
- Update backend integration docs when request/auth/proxy conventions change.
- Update the README when commands, minimum versions, or deployment behavior changes.

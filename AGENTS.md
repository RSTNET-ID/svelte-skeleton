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

## Shared UI component rules

- Reusable primitives belong in `src/lib/components/ui`, one PascalCase component per file, exported through `index.ts`.
- Compose with Svelte 5 `Snippet`, `$props()`, `$bindable()`, and `{@render ...}`. Do not add new Svelte 4 slot/event-dispatch patterns.
- Use native semantic HTML before recreating browser controls in JavaScript.
- A form field must have a visible label, stable ID, associated errors/hints and appropriate invalid state.
- Buttons default to `type="button"` and expose loading/disabled state.
- Do not style by constructing Tailwind class names dynamically from pieces. Use explicit complete strings in variant maps so the compiler can discover the classes.
- Use the provided tokens/variants before adding another palette. UI components must work in light and dark mode and with keyboard-only input.
- Avoid unnecessary abstractions: base controls are not a reason to build a large design-system framework.
- Page-specific composite components belong alongside their feature/route, not automatically in the UI primitives folder.
- The `/components` route demonstrates UI primitives. Keep examples in sync when components change.

## Agent execution protocol

1. Inspect existing files and relevant docs before edits. Never assume an old SvelteKit tutorial applies.
2. State the intended scope and identify affected layers (UI, API, server, tests, deployment).
3. Prefer minimal, localized changes; do not reformat unrelated files.
4. Implement and document behavioral changes together. Add regression coverage when feasible.
5. Run quality checks; explicitly report commands not run, failures and environmental blockers.
6. Do not claim tests passed or deployment succeeded without observing those results.
7. Never expose secrets, production customer data, or credentials in prompts, commits or logs.
8. Never silently change public API signatures, environment contracts, security defaults, or auth behavior.
9. When editing a shared primitive, consider accessibility, theme support, keyboard behavior, SSR, and hydration.
10. Preserve compatibility with the Bun backend; the frontend must not become a parallel owner of business rules.

## Agent entrypoints

`AGENTS.md` is canonical for every agent. `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, and `.cursor/rules/svelte-skeleton.mdc` point back here and only describe tooling-specific workflows. Resolve conflicts by following this file; security rules take precedence.

## Mandatory base components: STRICT RULE

**MUST:** Every route/page/feature uses the shared primitives exported by `#lib/components/ui/index.ts` for user input and interactive form controls. Applies equally to public pages, CMS pages, create/edit forms, search, filters, modals and settings.

**FORBIDDEN outside `src/lib/components/ui/`:** direct `<input>`, `<textarea>`, `<select>` or hand-rolled replacements for existing base components. Native HTML controls may be implemented inside the base component layer only. Do not use raw input elements in a page, even when they appear simpler.

**MUST:** Use `Input`, `Textarea`, `Button`, `AutoNumericInput`, `DatePicker`, `SelectAjax` or additional shared base components. If a requested feature needs a control that does not exist, implement or extend a reusable base component FIRST, then use it in the page. Do not bypass the rule due to deadlines or create page-local input wrappers. No third-party widget directly in route code: wrap it in a base component with a stable public API.

**MUST:** Keep all shared components configurable through props, Svelte 5 snippets, typed callbacks and bindable values. No page-specific URLs, fixed option catalogs, fixed permission checks or domain schemas inside generic UI controls.

**MUST:** Shared helpers go into `src/lib/helpers/`, exported through `index.ts`, with tests for nontrivial behavior. Check existing helpers before creating local formatters, normalizers, URL builders, string/date/number utilities. Helpers must be pure when possible, locale/timezone explicit, and never handle secrets or authorization decisions.

**MUST:** Public routes belong to `src/routes/(public)/`; CMS routes to `src/routes/(cms)/cms/`. CMS must enforce server-side identity and authorization. An authentication gate is not a replacement for endpoint-level permissions.

**FORBIDDEN:** Per-keypress AJAX network calls. `SelectAjax` uses debounce after typing stops, AbortController, stale result protection and `resolve(id)` for edit preselection.

Code review rejection criteria: any new page-local native input, duplicated helper, bypass of server auth boundary, or untested shared helper. Do not claim completion until full CI is green.

- **Select (regular)** MUST be used for local/static/preloaded options. **SelectAjax** MUST be used for backend-filtered datasets. Never implement a native `<select>` inside a page.

## Icon policy (mandatory)

- Use `@lucide/svelte` (Svelte 5-native). Import **each icon from its explicit subpath**, e.g. `import Search from '@lucide/svelte/icons/search';`.
- Do **not** import from the package root (`import { Search } from '@lucide/svelte'`), dynamically import an entire icon set, import `icons` dictionaries, or build a registry that eagerly imports every icon.
- Do **not** add icon fonts, remote icon CDNs, a second icon dependency, or global SVG sprite preload.
- Decorative icons require `aria-hidden="true"`; icon-only buttons require an accessible label. Reuse `Button` for icon actions.
- Icons are presentation components, not a reason to bypass mandatory UI base components.
- Avoid adding a generic `Icon name={string}` wrapper backed by a complete registry. Direct imports permit smaller per-route bundles.

## Internationalization (mandatory, ID and EN)

- ALL user-facing UI text MUST use translation keys from `src/lib/i18n/index.ts`. This includes labels, buttons, headings, navigation, validation messages, placeholders, empty states, toasts, dialogs, error states and accessibility labels.
- Default language is Indonesian (`id`); English (`en`) is required for every new translation key. Missing counterparts block review. Avoid hard-coded visible strings in pages, layouts and base components.
- Use `translate(locale, key, params)`; keys must be typed. Never build translation keys dynamically from arbitrary API input.
- Locale MUST be decided on the server from the `app_locale` HttpOnly cookie, with a safe `id` fallback. Do not decide initial language using `localStorage`, which causes SSR hydration mismatches.
- Reuse `LanguageSwitcher` for both public and CMS. The same-origin POST endpoint changes the cookie and redirects back to a safe local URL.
- Use locale-aware `Intl` formatters and explicitly supplied time zone for dates and currency. Backend field values and API enum codes must never be translated as storage values.
- Keep translations in a small local dictionary; do not add a heavy internationalization runtime by default.
- Add tests for translation keys, interpolation and locale validation when modifying the i18n layer.

# GitHub Copilot Instructions

Follow [AGENTS.md](../AGENTS.md) as the canonical project instruction file.

This is a SvelteKit 3 / Svelte 5 / Bun project. Use TypeScript strict, Svelte runes, snippets, Tailwind 4, and the project UI components under `src/lib/components/ui`. Do not add legacy `$lib` alias usage, `$env/*` imports, or `svelte.config.js`.

Keep authentication/session semantics in Bun, credentials out of browser storage, and private requests server-only. Before marking work complete, run the appropriate `bun run` quality checks or report why they were not run.

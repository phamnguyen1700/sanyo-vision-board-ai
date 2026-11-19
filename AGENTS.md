# Sanyo Vision Board FE

Before changing frontend code, read:

- `FRONTEND_IMPLEMENTATION_GUIDELINES.md`

All new work must follow the documented flow:

```text
type → service → hooks / Zustand → feature
```

Feature structure must use `components/` and `index.tsx`. Reuse primitives from
`src/components/ui` and reusable UI from `src/components/common`.

Do not hard-code UI styling in components. Reuse and extend classes/tokens in
`src/app/globals.css`. Reuse existing components, styles, utilities and assets;
ask before creating a new shared component, styling pattern, utility or asset
when an existing implementation does not cover the need.

Run `pnpm build` after every code change.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

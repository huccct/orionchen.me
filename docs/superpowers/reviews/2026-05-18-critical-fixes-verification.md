# Code Review (Second Pass) — orionchen.me Critical-Fix Verification

- **Date**: 2026-05-18
- **Reviewer**: superpowers:requesting-code-review (general-purpose subagent, second pass)
- **Repo**: `~/Frontend/orionchen.me`
- **Range**: `2ad930f..678f373` (6 fix commits)
- **First review**: `~/Frontend/blog/docs/superpowers/reviews/2026-05-18-personal-studio-v2-review.md` — 4 Critical + 7 Important + 8 Minor; user-promoted I1 and I3 to Critical.
- **Verdict**: ✅ **Ready to merge** — all 6 Critical verified solved; no regression introduced.

## Per-Fix Verification

| # | Fix commit | Status | Verification summary |
|---|---|---|---|
| C1 vitest unrunnable | `151e2ba` | ✅ verified | `vitest`/`@vitest/ui` 3.2.4; `"type": "module"` in package.json; `__dirname` → `import.meta.dirname` in `next.config.ts` (incl. `turbopack.root`) and `vitest.config.ts`; `pnpm test` → 17/17 pass; build still works. |
| C2 Noto Serif SC stub | `efcb040` | ✅ verified | `src/lib/fonts.ts:22-27` is real `Noto_Serif_SC` loader; `.font-noto-serif-sc-fallback` removed from globals.css; `notoSerifSC.variable` still on `<html>` in layout. |
| C3 external `<img>` 400 | `0a0dfba` | ✅ verified | `mdx-components.tsx:9-22` `isLocalSrc` guard; built `.next/server/app/blog/canvas-drag.html` contains raw `<img src="https://cdn.jsdelivr.net/...">` (loading="lazy"); local `/images/works/*` covers still routed through `/_next/image`. Bypass route avoids open-ended whitelist. |
| C4 documentary 404 + dead `content` | `ab479f8` | ✅ verified | schemas.ts has `hasDetail: z.boolean().optional().default(false)`, no `content` field; built homepage renders documentary card as inert `<div aria-disabled="true">` with "coming soon" badge, no `href`; xialiao/movorca/agent-flow-viz still external `<a>` links; 0 `/works/[slug]` static pages generated. |
| C5 single-digit date sort | `6e74823` | ✅ verified | `normalizeDate()` regex+padStart in migrate script; 4 mdx files now ISO; zero unpadded dates remain in posts/; 2 new tests pass; built blog list shows `2025-01-05` above `2024-12-10` above `2024-03-25` (correct desc). |
| C6 inverted typography | `678f373` | ✅ verified | No `--text-*` overrides remain in globals.css `@theme`; H1/H2/H3 all bumped to literal Tailwind defaults; rendered hierarchy strictly monotonic: hero (48-60px) > post H1 (36px) > h2 (24px) > h3 (20px) > body (16px). |

## Cross-Cutting Gates

- `pnpm test` → 17/17 passing
- `pnpm typecheck` → exit 0
- `pnpm lint` → exit 0
- `pnpm build` → exit 0; 32 `/blog/[slug]` static pages, zero `/works/[slug]` static pages

## New Issues Introduced

- Critical: **none**
- Important: **none**
- Minor:
  1. content-collections deprecation warning emitted twice during build:
     `[CC DEPRECATED]: The implicit addition of a content property to schemas is deprecated`
     C4 dropped the explicit `content` field; CC now silently injects it. Adding `content: z.string().optional()` back to `postSchema`/`workSchema` would silence this and future-proof. Non-blocking.
  2. `globals.css` still has both `@theme` (lines 11-29) and `@theme inline` (lines 74-...) blocks; the inline block redefines `--font-sans`/`--font-mono` already present above. Not introduced by these fixes — predates C6.

## Reviewer's Verdict

> **Ready to merge:** Yes
>
> All 6 Critical fixes verified against source and built HTML; full toolchain (test/typecheck/lint/build) green; no regression introduced. The only follow-up is the content-collections deprecation warning, which is non-blocking and unrelated to the issues in scope.

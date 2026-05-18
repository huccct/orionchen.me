# Code Review — orionchen.me v2 Rewrite

- **Date**: 2026-05-18
- **Reviewer**: superpowers:requesting-code-review (general-purpose subagent)
- **Repo**: `~/Frontend/orionchen.me`
- **Range**: `0165ac2..2ad930f` (37 commits, plan tasks 1-37)
- **Verdict**: **Not ready to merge — with fixes** (4 Critical, 7 Important, 8 Minor)

## Critical (Must Fix)

### C1. `pnpm test` cannot start (vitest 4.x ESM mismatch)
- File: `vitest.config.ts` + `package.json` (vitest@4.1.6)
- Error: `ERR_REQUIRE_ESM` on `std-env@4.1.0` at vitest config-load.
- Why it matters: plan **explicitly required TDD** for migration script and schemas. A test runner that won't start invalidates that discipline; future regressions in `mapFrontmatter` / `migrateOne` / `postSchema` / `workSchema` won't be caught.
- Fix (preferred): add `"type": "module"` to `package.json`, rename `vitest.config.ts` → `vitest.config.mts`. Verify `pnpm migrate` still runs.
- Alt: pin `vitest@^3 @vitest/ui@^3`.

### C2. Noto Serif SC font silently not loaded
- File: `src/lib/fonts.ts:22-24`
- `notoSerifSC` was rewritten to a stub object during Task 9 (shadcn init) — `--font-noto-serif-sc` resolves to nothing.
- Why it matters: Chinese display typography (most post titles) falls back to system fonts; spec §6 visual identity directly violated.
- Fix: restore the original `Noto_Serif_SC({ subsets: ['latin'], variable: '--font-noto-serif-sc', weight: ['400','700'], display: 'swap' })` loader. Drop the dead `.font-noto-serif-sc-fallback` rule from `globals.css:7-9`.

### C3. External CDN images will 400 in production
- File: `next.config.ts` (no `images.remotePatterns`); `src/components/mdx/mdx-components.tsx:9-22` wraps all `<img>` in `next/image`.
- Built HTML routes CDN URLs through `/_next/image` → host whitelist rejects them.
- Why it matters: most of 32 posts have `cdn.jsdelivr.net` images. Production launches with broken visuals on the bulk of `/blog/[slug]`.
- Fix: add to `next.config.ts`:
  ```ts
  images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.jsdelivr.net' }] }
  ```

### C4. `documentary-ep01` work card → 404 click-through
- Files: `src/components/work-card.tsx:11-14`, `src/app/works/[slug]/page.tsx:7,13-14`
- Root cause: `documentary-ep01.mdx` has no `links.*` AND no body. The `hasBody` heuristic (Important #2) is always false; `firstExternalLink` returns null; `dynamicParams = false` means no static page exists for this slug. Click → 404.
- Why it matters: it's a featured card on the homepage. First-impression broken link.
- Fix options:
  - (a) Author a placeholder body for `documentary-ep01.mdx`
  - (b) Make WorkCard render a non-link "coming soon" card when no body and no external link
  - (c) Both

## Important (Should Fix)

### I1. Post dates not normalized — blog list sorts wrong
- 4 posts have `date: 2025-1-05` style (single-digit month). `localeCompare` puts them after `2024-12-31` lexicographically.
- Fix: normalize to ISO in `mapFrontmatter`; hand-fix the 4 affected files.
- **My take: I'd promote this to Critical** — user-visible blog ordering bug.

### I2. `work.content` is dead code; `hasBody` always false
- `content` field added to `workSchema` was never populated by content-collections.
- Fix: replace heuristic with explicit `hasDetail: boolean` frontmatter flag, drop `content` field, add Vitest case.

### I3. `--text-xl: 4rem` overrides Tailwind v4 default → inverted hierarchy
- Post H1 (`text-xl`) now renders 64px while homepage hero (`text-5xl`) renders 48px. Post titles are bigger than the hero.
- Fix: don't override `--text-xs..xl` (use literals), or rename to non-conflicting tokens (`--text-hero` etc.).
- **My take: I'd promote this to Critical** — visual hierarchy is inverted on every blog post.

### I4. SiteHeader missing mobile menu (plan Task 18)
- Just shrinks gap on small screens; 4 nav items + brand + toggle overflows on narrow phones.

### I5. Migration `migrateOne` test doesn't exercise the "filename-wins" contract
- Test fixture happens to match; doesn't catch slug disagreement bugs.

### I6. README is the create-next-app default

### I7. `MDXImage` hard-codes 1200×675 for every inline image

## Minor

- M1. `lucide-react@1.16.0` is very fresh v1 major bump — verify no breaking icon renames
- M2. shadcn-injected `:root`/`.dark` blocks duplicate token wiring in `globals.css`
- M3. `format:check` script missing from package.json (plan Task 2)
- M4. `scripts/smoke-old-urls.sh` defaults to a literal placeholder host
- M5. Section "all" labels lost the "→" arrow from plan
- M6. `siteConfig.giscus.{repoId,categoryId}` blank strings; component renders disabled silently
- M7. Em-dash style nitpicks in CLAUDE.md/OPERATIONS.md
- M8. `EarlyContentBanner` text could trim shorter

## Plan Conformance

37/37 tasks → 37 commits, 1:1, all Conventional Commits, all in plan order. Granularity rule honored. Task 38 (Vercel/DNS cutover) correctly not a code commit.

Tasks with deviation flags: 2, 9, 11, 15, 16, 18, 20, 23, 24, 25, 26, 37. Most are the cascading effects of C2/C3/C4/I1/I2/I3.

## Strengths (don't lose these in the fix pass)

- Plan/commit 1:1 perfect; no merging or skipping
- Schema TDD coverage real (no mocks); 6 cases all present
- `pnpm typecheck` and `pnpm lint` pass cleanly
- `pnpm build` succeeds (Next 16.2.6 + Turbopack, 66 static pages)
- DESIGN.md is original prose (not a paste from any awesome-design-md template)
- 308 redirects implemented correctly
- No forbidden surface (no newsletter, paywall, chatbot, framer-motion, gsap, lottie)
- No emoji icons
- RSS XML escaping is **safer** than the plan version (CDATA + xmlEscape helpers)
- `/tags/[tag]` adds `decodeURIComponent` (improvement over plan)

## My Severity Adjustments to Reviewer's Categorization

| Reviewer said | I'd say | Why |
|---|---|---|
| I1 (date sort) | **Critical** | User-visible ordering bug on the busiest page |
| I3 (typography) | **Critical** | Inverted hierarchy on every blog post; visual identity collapse |
| Others | (agree) | |

So: **6 Critical, 5 Important, 8 Minor** by my counting.

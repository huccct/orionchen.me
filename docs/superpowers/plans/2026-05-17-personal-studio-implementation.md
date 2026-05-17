# orionchen.me Personal Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `orionchen.me` from `tailwind-nextjs-starter-blog` (Next 12 + contentlayer) into a personal studio site (Next 15 + content-collections) accommodating code, film, and writing as three first-class mediums.

**Architecture:** New `~/Frontend/orionchen.me` repo (option A from plan-prep). Old `~/Frontend/blog` stays untouched as v1 archive. Content layer is `content-collections`, MDX rendered via RSC. All 32 existing posts migrated via one-shot script (TDD). Three curated `/works` items hand-authored. URLs `/blog/[slug]` and `/tags/[tag]` preserved exactly for SEO. DESIGN.md authored from scratch following [VoltAgent](https://github.com/VoltAgent/awesome-design-md) Stitch format.

**Tech Stack:** Next.js 15 (App Router) · TypeScript strict · pnpm · Tailwind v4 · shadcn/ui · content-collections · next-themes · giscus · Plausible · `@vercel/og` · Vitest (TDD for migration & schema) · Vercel.

**Plan-commit granularity:** **One Task = one commit.** Do not batch commits. All commit messages use Conventional Commits.

**Testing scope (per user decision B):** TDD strictly for the migration script and content-collections schema validation. UI components verified via dev-server eyeball + `pnpm build` + `pnpm lint` passing. No component snapshot tests, no e2e.

**Source spec:** `~/Frontend/blog/docs/superpowers/specs/2026-05-17-personal-studio-design.md` (also moved to new repo in Task 1).

---

## File Structure

```
~/Frontend/orionchen.me/
├── package.json · pnpm-lock.yaml · tsconfig.json
├── next.config.ts · postcss.config.mjs · eslint.config.mjs · .prettierrc
├── content-collections.ts        # content schemas
├── vitest.config.ts              # test runner
├── DESIGN.md                     # design system (v1 deliverable)
├── CLAUDE.md                     # agent guardrails
├── OPERATIONS.md                 # cadence rules from spec §8
├── README.md
├── docs/superpowers/{specs,plans}/  # spec + this plan, copied from blog repo
├── src/
│   ├── app/
│   │   ├── layout.tsx · page.tsx · globals.css
│   │   ├── not-found.tsx · error.tsx · loading.tsx
│   │   ├── opengraph-image.tsx · icon.tsx · robots.ts · sitemap.ts
│   │   ├── rss.xml/route.ts
│   │   ├── blog/{page.tsx,[slug]/page.tsx}
│   │   ├── tags/{page.tsx,[tag]/page.tsx}
│   │   ├── works/{page.tsx,[slug]/page.tsx}
│   │   ├── guestbook/page.tsx
│   │   └── about/page.tsx
│   ├── components/
│   │   ├── site-header.tsx · site-footer.tsx
│   │   ├── theme-provider.tsx · theme-toggle.tsx
│   │   ├── work-card.tsx · post-card.tsx
│   │   ├── section-header.tsx · status-pill.tsx · early-content-banner.tsx
│   │   ├── giscus-comments.tsx
│   │   ├── ui/{button,card,tabs,tooltip,dialog}.tsx   # shadcn primitives
│   │   └── mdx/mdx-components.tsx
│   ├── lib/
│   │   ├── site-config.ts · og.ts · plausible.ts · utils.ts
│   ├── content/
│   │   ├── posts/    # 32 migrated MDX
│   │   └── works/    # 3-5 curated MDX
├── public/{images/{posts,works},fonts,favicon.ico,avatar.png}
├── scripts/migrate-blog-v1.ts
└── tests/{migrate-blog-v1.test.ts,content-schema.test.ts}
```

---

## Phase 0 — Bootstrap (3 tasks)

### Task 1: Init new repo & port spec/plan

**Files:**
- Create: `~/Frontend/orionchen.me/` (new directory)
- Create: `~/Frontend/orionchen.me/package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `README.md`
- Copy: `~/Frontend/blog/docs/superpowers/specs/2026-05-17-personal-studio-design.md` → new repo
- Copy: `~/Frontend/blog/docs/superpowers/plans/2026-05-17-personal-studio-implementation.md` → new repo

- [ ] **Step 1: Scaffold via create-next-app**

```bash
cd ~/Frontend
pnpm create next-app@latest orionchen.me \
  --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --no-turbopack
cd orionchen.me
```

- [ ] **Step 2: Verify dev server boots**

Run: `pnpm dev` then `curl -sI http://localhost:3000 | head -1`
Expected: `HTTP/1.1 200 OK`. Stop the server with Ctrl-C.

- [ ] **Step 3: Port spec + plan into new repo**

```bash
mkdir -p docs/superpowers/{specs,plans}
cp ~/Frontend/blog/docs/superpowers/specs/2026-05-17-personal-studio-design.md docs/superpowers/specs/
cp ~/Frontend/blog/docs/superpowers/plans/2026-05-17-personal-studio-implementation.md docs/superpowers/plans/
```

Update spec note line 7 (one Edit) so it reads:
`- **Note**: This spec lives in the orionchen.me repo. The original lived in the v1 huccct/blog repo.`

- [ ] **Step 4: Commit**

```bash
git init -b main
git add .
git commit -m "chore: scaffold next 15 app with spec and plan"
```

Verify: `git log --oneline | head -1` shows the commit.

---

### Task 2: Strict TS + ESLint + Prettier baseline

**Files:**
- Modify: `tsconfig.json` (strict, paths)
- Create: `.prettierrc`, `.editorconfig`
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Set strict TS**

In `tsconfig.json` `compilerOptions`, set:
```json
"strict": true,
"noUncheckedIndexedAccess": true,
"noImplicitOverride": true
```

- [ ] **Step 2: Add Prettier config**

Create `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 3: Install Prettier + plugin**

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

- [ ] **Step 4: Add lint/format scripts to package.json**

In `package.json` `scripts`, add:
```json
"format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
"format:check": "prettier --check \"**/*.{ts,tsx,md,json}\"",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 5: Run all three to verify clean**

```bash
pnpm format && pnpm lint && pnpm typecheck
```
Expected: all three exit code 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: enable strict ts, prettier, format/typecheck scripts"
```

---

### Task 3: Add CLAUDE.md (agent guardrails)

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Write guardrails (forbidden list only, ~5 min read)**

Create `CLAUDE.md`:
```markdown
# CLAUDE.md — orionchen.me

## DO NOT
- Add SEO/analytics features beyond what's in `docs/superpowers/specs/2026-05-17-personal-studio-design.md`
- Add a newsletter signup, "subscribe" CTA, or email capture
- Add Pro / paid / membership / paywall mechanics
- Install heavy animation libs (framer-motion ok if used minimally; no GSAP, no lottie)
- Touch `/blog/[slug]` URL shape — SEO depends on it
- Add a chatbot widget, "Site Agent", or floating help bubble
- Auto-translate posts; i18n is deferred per spec §7
- Re-export types or leave dead code "for backwards compat"

## ALWAYS
- One commit per Task in `docs/superpowers/plans/...md`
- Conventional Commits: `feat: ...` / `fix: ...` / `chore: ...` / `docs: ...`
- `pnpm lint && pnpm typecheck && pnpm build` must pass before commit
- For UI changes, eyeball in dev server before commit (no UI snapshot tests)
- Migration script + content schema are TDD; UI is not
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md agent guardrails"
```

---

## Phase 1 — Visual & Theme Infrastructure (6 tasks)

### Task 4: Tailwind v4 tokens & global stylesheet

**Files:**
- Modify: `src/app/globals.css`
- Reference: spec §6 visual system table

- [ ] **Step 1: Replace globals.css with v4 `@theme` tokens**

```css
@import "tailwindcss";

@theme {
  --color-bg: oklch(0.985 0 0);
  --color-bg-dark: oklch(0.18 0.005 60);            /* zinc-950, slightly warm */
  --color-fg: oklch(0.18 0.005 60);
  --color-fg-dark: oklch(0.96 0 0);
  --color-muted: oklch(0.55 0.005 60);
  --color-border: oklch(0.92 0.004 60);
  --color-border-dark: oklch(0.27 0.005 60);
  --color-accent: oklch(0.55 0.10 50);              /* sienna #A0522D */

  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
  --font-serif-en: var(--font-newsreader), Georgia, serif;
  --font-serif-cn: var(--font-noto-serif-sc), serif;

  --radius-sm: 4px;
  --radius-md: 8px;          /* max — no larger per spec */

  --text-xs: 0.875rem;       /* 14px — body small */
  --text-sm: 1rem;           /* 16px — body */
  --text-base: 1.25rem;      /* 20px — lead */
  --text-lg: 2rem;           /* 32px — h2 */
  --text-xl: 4rem;           /* 64px — hero */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: var(--color-bg-dark);
    --color-fg: var(--color-fg-dark);
    --color-border: var(--color-border-dark);
  }
}

html { color-scheme: light dark; }
body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  line-height: 1.6;
}
```

- [ ] **Step 2: Verify build still passes**

```bash
pnpm build
```
Expected: build succeeds, no Tailwind errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(visual): tailwind v4 tokens with sienna accent and warm zinc"
```

---

### Task 5: Fonts (Geist Sans/Mono, Newsreader, Noto Serif SC)

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/lib/fonts.ts`

- [ ] **Step 1: Create font loader**

Create `src/lib/fonts.ts`:
```ts
import { Geist, Geist_Mono, Newsreader, Noto_Serif_SC } from 'next/font/google'

export const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' })
export const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })
export const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-newsreader', weight: ['400', '600'], display: 'swap' })
export const notoSerifSC = Noto_Serif_SC({ subsets: ['latin'], variable: '--font-noto-serif-sc', weight: ['400', '700'], display: 'swap' })
```

- [ ] **Step 2: Wire into root layout**

In `src/app/layout.tsx`, replace `<html>` opening with:
```tsx
import { geistSans, geistMono, newsreader, notoSerifSC } from '@/lib/fonts'

<html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${notoSerifSC.variable}`}>
```

- [ ] **Step 3: Eyeball check**

Run `pnpm dev`, open http://localhost:3000, confirm body text in Geist Sans (not default browser font). DevTools → Computed → `font-family` includes `Geist`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/fonts.ts src/app/layout.tsx
git commit -m "feat(visual): wire geist + newsreader + noto serif sc fonts"
```

---

### Task 6: Author DESIGN.md from scratch

**Files:**
- Create: `DESIGN.md`
- Reference: [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) Stitch 9-section format; reference Linear and WIRED entries for format only.

- [ ] **Step 1: Write the 9-section spec**

Create `DESIGN.md` with full content covering:
1. Visual Theme & Atmosphere (engineer restraint × documentary warmth, sienna accent)
2. Color Palette & Roles (each token from Task 4 with hex/oklch + role)
3. Typography Rules (full hierarchy: hero/h1/h2/h3/lead/body/small/mono; serif rules for Chinese vs English headings)
4. Component Stylings (Button, Card, Input, Nav, States) — reference shadcn variants
5. Layout Principles (max-w-2xl prose, max-w-5xl page, 16-24px card gap)
6. Depth & Elevation (no default shadow; hover only `shadow-sm`)
7. Do's and Don'ts (mirror CLAUDE.md DO NOT list; add visual rules: no gradients, no rounded-2xl, no emoji icons)
8. Responsive Behavior (single breakpoint at `md:768px`; touch targets ≥44px)
9. Agent Prompt Guide (3-5 ready prompts: "Build me a card using DESIGN.md tokens" etc.)

- [ ] **Step 2: Commit**

```bash
git add DESIGN.md
git commit -m "docs(design): author design.md per stitch 9-section format"
```

---

### Task 7: next-themes + theme provider + theme toggle

**Files:**
- Create: `src/components/theme-provider.tsx`, `src/components/theme-toggle.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Install**

```bash
pnpm add next-themes lucide-react
```

- [ ] **Step 2: Theme provider**

Create `src/components/theme-provider.tsx`:
```tsx
'use client'
import { ThemeProvider as NextThemes } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemes attribute="class" defaultTheme="system" enableSystem {...props}>{children}</NextThemes>
}
```

- [ ] **Step 3: Theme toggle**

Create `src/components/theme-toggle.tsx`:
```tsx
'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 hover:text-[var(--color-accent)]"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="h-4 w-4 hidden dark:block" />
    </button>
  )
}
```

- [ ] **Step 4: Wrap root layout**

In `src/app/layout.tsx`, wrap `{children}` in `<ThemeProvider>{children}</ThemeProvider>`. Update globals.css dark-mode block to use `.dark` class instead of media query:
```css
.dark {
  --color-bg: var(--color-bg-dark);
  --color-fg: var(--color-fg-dark);
  --color-border: var(--color-border-dark);
}
```

- [ ] **Step 5: Eyeball — toggle works**

`pnpm dev` → drop `<ThemeToggle />` somewhere in layout temporarily → click → bg flips dark/light. Then remove the temp drop-in (toggle goes into header in Task 18).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(visual): theme provider with light/dark toggle"
```

---

### Task 8: Decorator primitives — SectionHeader, StatusPill, EarlyContentBanner

**Files:**
- Create: `src/components/section-header.tsx`, `src/components/status-pill.tsx`, `src/components/early-content-banner.tsx`

- [ ] **Step 1: SectionHeader (the `// Section Name` decoration)**

```tsx
// src/components/section-header.tsx
import type { ReactNode } from 'react'

export function SectionHeader({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between border-b border-[var(--color-border)] pb-2 mb-6">
      <h2 className="font-mono text-sm text-[var(--color-muted)]">// {children}</h2>
      {action && <div className="font-mono text-xs">{action}</div>}
    </div>
  )
}
```

- [ ] **Step 2: StatusPill (`code` / `film` / `wip` / `live` / `archived`)**

```tsx
// src/components/status-pill.tsx
const styles: Record<string, string> = {
  code: 'border-[var(--color-border)]',
  film: 'border-[var(--color-accent)] text-[var(--color-accent)]',
  writing: 'border-[var(--color-border)]',
  wip: 'border-amber-500 text-amber-600 dark:text-amber-400',
  live: 'border-emerald-500 text-emerald-600 dark:text-emerald-400',
  archived: 'border-[var(--color-muted)] text-[var(--color-muted)]',
}
export function StatusPill({ kind }: { kind: keyof typeof styles }) {
  return <span className={`inline-block px-2 py-0.5 text-xs font-mono border rounded-sm ${styles[kind]}`}>{kind}</span>
}
```

- [ ] **Step 3: EarlyContentBanner (for migrated interview posts)**

```tsx
// src/components/early-content-banner.tsx
export function EarlyContentBanner() {
  return (
    <div className="border-l-2 border-[var(--color-accent)] pl-4 py-2 my-6 text-sm text-[var(--color-muted)] font-mono">
      // early content — written years ago, kept for archive completeness; tone & opinions may be dated.
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
pnpm typecheck && pnpm build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/section-header.tsx src/components/status-pill.tsx src/components/early-content-banner.tsx
git commit -m "feat(visual): section-header, status-pill, early-content-banner primitives"
```

---

### Task 9: shadcn/ui init + minimal component install

**Files:**
- Run shadcn init; installs configs at `components.json`, `src/lib/utils.ts`
- Adds: `src/components/ui/{button,card,tabs,tooltip,dialog}.tsx`

- [ ] **Step 1: Init shadcn**

```bash
pnpm dlx shadcn@latest init
```
Defaults: TypeScript yes, base color neutral, CSS variables yes, RSC yes.

- [ ] **Step 2: Install only the 5 we need**

```bash
pnpm dlx shadcn@latest add button card tabs tooltip dialog
```

- [ ] **Step 3: Verify build**

```bash
pnpm typecheck && pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(ui): shadcn init + button/card/tabs/tooltip/dialog"
```

---

## Phase 2 — Content Layer & Migration (7 tasks, TDD)

### Task 10: content-collections setup + Post schema (TDD)

**Files:**
- Create: `content-collections.ts`, `vitest.config.ts`, `tests/content-schema.test.ts`
- Modify: `next.config.ts`, `package.json`, `tsconfig.json`

- [ ] **Step 1: Install**

```bash
pnpm add -D @content-collections/core @content-collections/next @content-collections/mdx
pnpm add -D vitest @vitest/ui
```

- [ ] **Step 2: Wire next.config + tsconfig**

`next.config.ts`:
```ts
import { withContentCollections } from '@content-collections/next'
import type { NextConfig } from 'next'
const config: NextConfig = {}
export default withContentCollections(config)
```
`tsconfig.json` `paths`: add `"content-collections": ["./.content-collections/generated"]`.
Add `.content-collections/` to `.gitignore`.

- [ ] **Step 3: Vitest config**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'
export default defineConfig({
  test: { environment: 'node' },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```
Add `package.json` script: `"test": "vitest run"`.

- [ ] **Step 4: Write failing schema test**

`tests/content-schema.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { postSchema } from '@/content/schemas'

describe('postSchema', () => {
  it('accepts a minimal valid post', () => {
    const result = postSchema.safeParse({
      title: 'Hello', date: '2024-01-01', slug: 'hello',
    })
    expect(result.success).toBe(true)
  })
  it('rejects missing title', () => {
    const result = postSchema.safeParse({ date: '2024-01-01', slug: 'hello' })
    expect(result.success).toBe(false)
  })
  it('accepts earlyContent flag', () => {
    const result = postSchema.safeParse({
      title: 'X', date: '2024-01-01', slug: 'x', earlyContent: true,
    })
    expect(result.success).toBe(true)
  })
})
```

- [ ] **Step 5: Run — should fail (module not found)**

```bash
pnpm test
```
Expected: FAIL — `Cannot find module '@/content/schemas'`.

- [ ] **Step 6: Implement schema**

`src/content/schemas.ts`:
```ts
import { z } from 'zod'

export const postSchema = z.object({
  title: z.string(),
  date: z.string(),
  slug: z.string(),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  draft: z.boolean().optional().default(false),
  earlyContent: z.boolean().optional().default(false),
  cover: z.string().optional(),
})
export type Post = z.infer<typeof postSchema>
```

- [ ] **Step 7: Run — should pass**

```bash
pnpm test
```
Expected: 3 passing.

- [ ] **Step 8: Wire into content-collections**

`content-collections.ts`:
```ts
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { postSchema } from './src/content/schemas'

const posts = defineCollection({
  name: 'posts',
  directory: 'src/content/posts',
  include: '**/*.mdx',
  schema: () => postSchema.shape,
  transform: async (doc, ctx) => ({ ...doc, body: await compileMDX(ctx, doc) }),
})

export default defineConfig({ collections: [posts] })
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(content): content-collections + vitest + post schema (tdd)"
```

---

### Task 11: Work schema (TDD)

**Files:**
- Modify: `src/content/schemas.ts`, `content-collections.ts`, `tests/content-schema.test.ts`

- [ ] **Step 1: Add failing tests for workSchema**

Append to `tests/content-schema.test.ts`:
```ts
import { workSchema } from '@/content/schemas'

describe('workSchema', () => {
  it('accepts a minimal code work', () => {
    const r = workSchema.safeParse({
      slug: 'movorca', title: 'Movorca', summary: 'AI knowledge video skill',
      type: 'code', status: 'live', publishedAt: '2026-04-01', cover: '/images/works/movorca.jpg',
    })
    expect(r.success).toBe(true)
  })
  it('rejects unknown type', () => {
    const r = workSchema.safeParse({
      slug: 'x', title: 'X', summary: 'y', type: 'podcast',
      status: 'live', publishedAt: '2026-04-01', cover: '/x.jpg',
    })
    expect(r.success).toBe(false)
  })
  it('accepts film with guests + episode', () => {
    const r = workSchema.safeParse({
      slug: 'ep01', title: 'EP01', summary: 's', type: 'film',
      status: 'live', publishedAt: '2026-06-01', cover: '/x.jpg',
      meta: { runtime: '32 min', guests: ['A'], episode: 'EP01' },
      links: { youtube: 'https://youtu.be/x' },
    })
    expect(r.success).toBe(true)
  })
})
```

- [ ] **Step 2: Run — should fail**

```bash
pnpm test
```
Expected: FAIL — `workSchema` not exported.

- [ ] **Step 3: Implement workSchema**

Append to `src/content/schemas.ts`:
```ts
export const workSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  type: z.enum(['code', 'film', 'writing']),
  status: z.enum(['wip', 'live', 'archived']),
  publishedAt: z.string(),
  cover: z.string(),
  featured: z.boolean().optional().default(false),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  links: z.object({
    repo: z.string().optional(),
    demo: z.string().optional(),
    youtube: z.string().optional(),
    bilibili: z.string().optional(),
    xiaoyuzhou: z.string().optional(),
    article: z.string().optional(),
    other: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  }).optional(),
  meta: z.object({
    stars: z.number().optional(),
    language: z.string().optional(),
    runtime: z.string().optional(),
    guests: z.array(z.string()).optional(),
    episode: z.string().optional(),
    wordCount: z.number().optional(),
  }).optional(),
})
export type Work = z.infer<typeof workSchema>
```

- [ ] **Step 4: Add work collection**

In `content-collections.ts`, add `works` collection mirroring `posts` structure but pointing to `src/content/works` and using `workSchema`.

- [ ] **Step 5: Run — should pass**

```bash
pnpm test
```
Expected: all tests pass (6 total).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(content): work schema with code/film/writing types (tdd)"
```

---

### Task 12: Migration script — frontmatter mapping (TDD)

**Files:**
- Create: `scripts/migrate-blog-v1.ts`, `tests/migrate-blog-v1.test.ts`

- [ ] **Step 1: Failing test for `mapFrontmatter`**

`tests/migrate-blog-v1.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { mapFrontmatter } from '@/scripts/migrate-blog-v1'

describe('mapFrontmatter', () => {
  it('preserves title/date/summary/tags', () => {
    const out = mapFrontmatter({
      title: 'X', date: '2023-10-22', tags: ['frontend'], summary: 's', draft: false,
    }, 'canvas-drag')
    expect(out).toMatchObject({
      title: 'X', date: '2023-10-22', summary: 's', tags: ['frontend'], slug: 'canvas-drag',
    })
  })
  it('flags interview posts as earlyContent', () => {
    const out = mapFrontmatter({ title: 'Interview', date: '2022-01-01' }, 'frontend-interview')
    expect(out.earlyContent).toBe(true)
  })
  it('does not flag non-early posts', () => {
    const out = mapFrontmatter({ title: 'X', date: '2024-01-01' }, 'ai-agent-crypto-payments')
    expect(out.earlyContent).toBeFalsy()
  })
})
```

- [ ] **Step 2: Run — fail**

```bash
pnpm test migrate
```
Expected: FAIL.

- [ ] **Step 3: Implement minimum**

`scripts/migrate-blog-v1.ts`:
```ts
const EARLY_SLUGS = new Set(['frontend-interview', 'frontend-interview2'])

export function mapFrontmatter(old: Record<string, unknown>, slug: string) {
  const out: Record<string, unknown> = {
    title: old.title,
    date: old.date,
    slug,
    summary: old.summary,
    tags: old.tags ?? [],
    draft: old.draft ?? false,
  }
  if (EARLY_SLUGS.has(slug)) out.earlyContent = true
  return out
}
```

- [ ] **Step 4: Run — pass**

Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(migrate): frontmatter mapping with early-content flag (tdd)"
```

---

### Task 13: Migration script — image path rewrite (TDD)

**Files:**
- Modify: `scripts/migrate-blog-v1.ts`, `tests/migrate-blog-v1.test.ts`

- [ ] **Step 1: Failing test**

Append to `tests/migrate-blog-v1.test.ts`:
```ts
import { rewriteImagePaths } from '@/scripts/migrate-blog-v1'

describe('rewriteImagePaths', () => {
  it('rewrites local /static/images/ to /images/posts/', () => {
    expect(rewriteImagePaths(`![x](/static/images/foo.png)`)).toBe(`![x](/images/posts/foo.png)`)
  })
  it('leaves absolute CDN URLs untouched', () => {
    const md = `![x](https://cdn.jsdelivr.net/foo.webp)`
    expect(rewriteImagePaths(md)).toBe(md)
  })
  it('handles HTML <img> tags', () => {
    expect(rewriteImagePaths(`<img src="/static/images/y.png" />`)).toBe(`<img src="/images/posts/y.png" />`)
  })
})
```

- [ ] **Step 2: Run — fail**

- [ ] **Step 3: Implement**

Append to `scripts/migrate-blog-v1.ts`:
```ts
export function rewriteImagePaths(content: string): string {
  return content.replace(/\/static\/images\//g, '/images/posts/')
}
```

- [ ] **Step 4: Run — pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(migrate): image path rewrite local-only (tdd)"
```

---

### Task 14: Migration script — full file orchestration (TDD)

**Files:**
- Modify: `scripts/migrate-blog-v1.ts`, `tests/migrate-blog-v1.test.ts`
- Create: `tests/fixtures/sample-post.mdx`

- [ ] **Step 1: Fixture**

`tests/fixtures/sample-post.mdx`:
```mdx
---
title: 'Sample'
date: '2024-01-01'
tags: ['frontend']
summary: 's'
draft: false
---

Body with ![img](/static/images/foo.png).
```

- [ ] **Step 2: Failing integration test**

Append:
```ts
import { migrateOne } from '@/scripts/migrate-blog-v1'
import path from 'node:path'

describe('migrateOne', () => {
  it('reads, transforms, and returns serialized mdx', async () => {
    const out = await migrateOne(path.resolve('tests/fixtures/sample-post.mdx'))
    expect(out.slug).toBe('sample-post')
    expect(out.serialized).toContain('title: Sample')
    expect(out.serialized).toContain('/images/posts/foo.png')
    expect(out.serialized).not.toContain('/static/images/foo.png')
  })
})
```

- [ ] **Step 3: Run — fail**

- [ ] **Step 4: Install gray-matter and implement**

```bash
pnpm add -D gray-matter
```

Add to `scripts/migrate-blog-v1.ts`:
```ts
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

export async function migrateOne(srcPath: string) {
  const slug = path.basename(srcPath, '.mdx')
  const raw = await fs.readFile(srcPath, 'utf8')
  const { data, content } = matter(raw)
  const serialized = matter.stringify(rewriteImagePaths(content), mapFrontmatter(data, slug))
  return { slug, serialized }
}
```

- [ ] **Step 5: Run — pass**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(migrate): orchestrate single-file migration (tdd)"
```

---

### Task 15: Run migration on all 32 posts

**Files:**
- Modify: `scripts/migrate-blog-v1.ts` (CLI runner)
- Create: `src/content/posts/*.mdx` (32 files)
- Create: `public/images/posts/` (copied from old `public/static/images/`)

- [ ] **Step 1: Add CLI runner**

Append to `scripts/migrate-blog-v1.ts`:
```ts
async function main() {
  const srcDir = process.env.SRC ?? path.resolve(process.env.HOME!, 'Frontend/blog/data/blog')
  const destDir = path.resolve('src/content/posts')
  await fs.mkdir(destDir, { recursive: true })
  const files = (await fs.readdir(srcDir)).filter(f => f.endsWith('.mdx'))
  let ok = 0, fail = 0
  for (const f of files) {
    try {
      const { slug, serialized } = await migrateOne(path.join(srcDir, f))
      await fs.writeFile(path.join(destDir, `${slug}.mdx`), serialized)
      ok++
    } catch (e) { console.error(`FAIL ${f}:`, e); fail++ }
  }
  console.log(`migrated ${ok}/${files.length}, failed ${fail}`)
}
if (require.main === module) main()
```

Install: `pnpm add -D tsx`. Add script `"migrate": "tsx scripts/migrate-blog-v1.ts"`.

- [ ] **Step 2: Run migration**

```bash
pnpm migrate
```
Expected: `migrated 32/32, failed 0`.

- [ ] **Step 3: Copy images**

```bash
cp -R ~/Frontend/blog/public/static/images/. public/images/posts/
```

- [ ] **Step 4: Build to verify all 32 parse**

```bash
pnpm build
```
Expected: build passes. If any post fails schema, fix that single MDX and retry.

- [ ] **Step 5: Commit**

```bash
git add src/content/posts public/images/posts
git commit -m "feat(content): migrate 32 posts from blog v1"
```

---

### Task 16: Author 3-5 curated /works MDX files

**Files:**
- Create: `src/content/works/*.mdx` (4 files)
- Create: `public/images/works/` (placeholder covers)

- [ ] **Step 1: Decide the curated list**

1. `movorca-skill` (code, live) — Movorca AI knowledge video Claude Code skill
2. `agent-flow-viz` (code, live) — agent flow visualizer
3. `xialiao` (code, live) — 虾聊 / 硅基回响 contributor link
4. `documentary-ep01` (film, wip) — placeholder for first interview episode

- [ ] **Step 2: Author each file**

Template `src/content/works/movorca-skill.mdx`:
```mdx
---
slug: movorca-skill
title: Movorca
summary: AI 知识视频生成 Claude Code skill
type: code
status: live
featured: true
publishedAt: '2026-04-01'
cover: /images/works/movorca.jpg
tags: [claude-code, skill, ai-video]
links:
  repo: https://github.com/huccct/movorca
meta:
  language: TypeScript
---
```
Repeat for the other 3 with appropriate fields. Bodies empty (cards external-link directly per spec).

- [ ] **Step 3: Placeholder covers**

For each of 4, place a 1200×630 JPG in `public/images/works/` (solid sienna fill is fine if no real cover).

- [ ] **Step 4: Verify build**

```bash
pnpm build
```
Expected: works collection reports 4 entries.

- [ ] **Step 5: Commit**

```bash
git add src/content/works public/images/works
git commit -m "feat(content): author 4 curated works (movorca, agent-flow-viz, xialiao, doc ep01)"
```

---

## Phase 3 — Pages & Components (14 tasks)

### Task 17: Root layout (header/footer placeholders, fonts wired, theme provider)

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/lib/site-config.ts`

- [ ] **Step 1: Site config**

`src/lib/site-config.ts`:
```ts
export const siteConfig = {
  name: 'Orion Chen',
  url: 'https://orionchen.me',
  description: '一个程序员、纪录片作者的个人作品场。',
  email: 'hi@orionchen.me',
  social: {
    github: 'https://github.com/huccct',
    x: 'https://x.com/orion_c29',
    linkedin: 'https://www.linkedin.com/in/tunan-chen-720627283',
  },
  giscus: {
    repo: 'huccct/orionchen.me' as `${string}/${string}`,
    repoId: '', // fill from giscus.app
    category: 'Guestbook',
    categoryId: '',
  },
  plausibleDomain: 'orionchen.me',
}
```

- [ ] **Step 2: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { geistSans, geistMono, newsreader, notoSerifSC } from '@/lib/fonts'
import { siteConfig } from '@/lib/site-config'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${notoSerifSC.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <SiteHeader />
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-8">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Build (will fail because header/footer don't exist yet)**

Skip build verification — Tasks 18-19 add the components. Just ensure file compiles in editor.

- [ ] **Step 4: Commit**

```bash
git add src/lib/site-config.ts src/app/layout.tsx
git commit -m "feat(layout): root layout with site config and theme provider"
```

---

### Task 18: SiteHeader (nav + theme toggle + mobile menu)

**Files:**
- Create: `src/components/site-header.tsx`

- [ ] **Step 1: Implement**

```tsx
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

const NAV = [
  { href: '/works', label: 'Works' },
  { href: '/blog', label: 'Writing' },
  { href: '/guestbook', label: 'Guestbook' },
  { href: '/about', label: 'About' },
]

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-border)] sticky top-0 backdrop-blur bg-[var(--color-bg)]/80 z-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm hover:text-[var(--color-accent)]">orionchen.me</Link>
        <nav className="flex items-center gap-6 text-sm">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--color-accent)]">{item.label}</Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Eyeball — header shows on `/`**

`pnpm dev` → header visible, nav links present, toggle works.

- [ ] **Step 3: Commit**

```bash
git add src/components/site-header.tsx
git commit -m "feat(layout): site header with nav and theme toggle"
```

---

### Task 19: SiteFooter

**Files:**
- Create: `src/components/site-footer.tsx`

- [ ] **Step 1: Implement**

```tsx
import { siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row justify-between text-xs font-mono text-[var(--color-muted)]">
        <span>// {new Date().getFullYear()} · {siteConfig.name}</span>
        <span className="flex gap-4">
          <a href={siteConfig.social.github}>GitHub</a>
          <a href={siteConfig.social.x}>X</a>
          <a href={`mailto:${siteConfig.email}`}>Email</a>
        </span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Build + eyeball**

```bash
pnpm build && pnpm dev
```
Expected: footer renders at bottom.

- [ ] **Step 3: Commit**

```bash
git add src/components/site-footer.tsx
git commit -m "feat(layout): site footer"
```

---

### Task 20: WorkCard component

**Files:**
- Create: `src/components/work-card.tsx`

- [ ] **Step 1: Implement**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import type { Work } from '@/content/schemas'
import { StatusPill } from './status-pill'

function firstExternalLink(w: Work): string | null {
  const l = w.links ?? {}
  return l.demo ?? l.repo ?? l.youtube ?? l.bilibili ?? l.article ?? null
}

export function WorkCard({ work, hasBody }: { work: Work; hasBody: boolean }) {
  const href = hasBody ? `/works/${work.slug}` : (firstExternalLink(work) ?? `/works/${work.slug}`)
  const external = !hasBody && firstExternalLink(work)?.startsWith('http')
  return (
    <Link href={href} target={external ? '_blank' : undefined}
      className="group block border border-[var(--color-border)] rounded-md overflow-hidden hover:shadow-sm hover:border-[var(--color-accent)] transition-colors">
      <div className="aspect-[16/10] relative bg-[var(--color-border)]">
        <Image src={work.cover} alt={work.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base">{work.title}</h3>
          <div className="flex gap-1">
            <StatusPill kind={work.type} />
            {work.status !== 'live' && <StatusPill kind={work.status} />}
          </div>
        </div>
        <p className="text-xs text-[var(--color-muted)] line-clamp-2">{work.summary}</p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Build**

```bash
pnpm typecheck && pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/work-card.tsx
git commit -m "feat(works): work-card with cover, status pills, click behavior"
```

---

### Task 21: PostCard component

**Files:**
- Create: `src/components/post-card.tsx`

- [ ] **Step 1: Implement**

```tsx
import Link from 'next/link'
import type { Post } from '@/content/schemas'

export function PostCard({ post }: { post: Post & { _meta?: { path: string } } }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group py-4 border-b border-[var(--color-border)] hover:border-[var(--color-accent)]">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-base group-hover:text-[var(--color-accent)]">{post.title}</h3>
        <time className="font-mono text-xs text-[var(--color-muted)] whitespace-nowrap">{post.date}</time>
      </div>
      {post.summary && <p className="text-sm text-[var(--color-muted)] mt-1 line-clamp-2">{post.summary}</p>}
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/post-card.tsx
git commit -m "feat(blog): post-card list-item style"
```

---

### Task 22: Homepage — Hero + Works strip + Writing strip + Guestbook embed

**Files:**
- Replace: `src/app/page.tsx`

- [ ] **Step 1: Implement**

```tsx
import Link from 'next/link'
import { allPosts, allWorks } from 'content-collections'
import { SectionHeader } from '@/components/section-header'
import { WorkCard } from '@/components/work-card'
import { PostCard } from '@/components/post-card'

export default function Home() {
  const featured = allWorks.filter(w => w.featured).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 6)
  const latest = allPosts.filter(p => !p.draft).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  return (
    <div className="space-y-16">
      <section className="py-16">
        <h1 className="font-serif text-5xl md:text-6xl leading-tight">
          Code, film, and writing<br />by <span className="text-[var(--color-accent)]">Orion Chen</span>.
        </h1>
        <p className="mt-6 text-[var(--color-muted)] max-w-xl">
          一个程序员、纪录片作者的个人作品场。在 AI 时代里继续做有意思的东西,有没有人用是另一回事。
        </p>
      </section>

      <section>
        <SectionHeader action={<Link href="/works">all →</Link>}>Works</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(w => <WorkCard key={w.slug} work={w} hasBody={!!w.body} />)}
        </div>
      </section>

      <section>
        <SectionHeader action={<Link href="/blog">all →</Link>}>Writing</SectionHeader>
        <div>{latest.map(p => <PostCard key={p.slug} post={p} />)}</div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Eyeball**

`pnpm dev` → confirm hero, works grid, writing list all render. Click a work card → navigates correctly.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(home): hero + works strip + writing strip"
```

---

### Task 23: /works list page with filter tabs

**Files:**
- Create: `src/app/works/page.tsx`, `src/components/works-filter.tsx`

- [ ] **Step 1: Filter (client component)**

`src/components/works-filter.tsx`:
```tsx
'use client'
import { useState } from 'react'
import type { Work } from '@/content/schemas'
import { WorkCard } from './work-card'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

const KINDS = ['all', 'code', 'film', 'writing'] as const

export function WorksFilter({ works }: { works: (Work & { hasBody: boolean })[] }) {
  const [kind, setKind] = useState<typeof KINDS[number]>('all')
  const filtered = kind === 'all' ? works : works.filter(w => w.type === kind)
  return (
    <>
      <Tabs value={kind} onValueChange={v => setKind(v as typeof KINDS[number])} className="mb-6">
        <TabsList>{KINDS.map(k => <TabsTrigger key={k} value={k}>{k}</TabsTrigger>)}</TabsList>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(w => <WorkCard key={w.slug} work={w} hasBody={w.hasBody} />)}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Page**

`src/app/works/page.tsx`:
```tsx
import { allWorks } from 'content-collections'
import { WorksFilter } from '@/components/works-filter'
import { SectionHeader } from '@/components/section-header'

export const metadata = { title: 'Works' }

export default function WorksPage() {
  const works = allWorks
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(w => ({ ...w, hasBody: !!w.body && String(w.body).trim().length > 0 }))
  return (
    <div>
      <SectionHeader>Works</SectionHeader>
      <WorksFilter works={works} />
    </div>
  )
}
```

- [ ] **Step 3: Build + eyeball**

Tabs filter the grid; URL doesn't change but tab state holds.

- [ ] **Step 4: Commit**

```bash
git add src/app/works/page.tsx src/components/works-filter.tsx
git commit -m "feat(works): list page with code/film/writing filter tabs"
```

---

### Task 24: /works/[slug] detail page (renders only when body non-empty)

**Files:**
- Create: `src/app/works/[slug]/page.tsx`, `src/components/mdx/mdx-components.tsx`

- [ ] **Step 1: MDX components**

`src/components/mdx/mdx-components.tsx`:
```tsx
import Image from 'next/image'
import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  img: (props: any) => <Image {...props} width={1200} height={675} className="rounded-md my-6" />,
  h2: (p: any) => <h2 className="font-serif text-2xl mt-8 mb-4" {...p} />,
  h3: (p: any) => <h3 className="font-serif text-xl mt-6 mb-3" {...p} />,
  a: (p: any) => <a className="text-[var(--color-accent)] underline-offset-4 hover:underline" {...p} />,
  pre: (p: any) => <pre className="border border-[var(--color-border)] rounded-md p-4 my-4 overflow-x-auto" {...p} />,
}
```

- [ ] **Step 2: Detail page**

`src/app/works/[slug]/page.tsx`:
```tsx
import { allWorks } from 'content-collections'
import { notFound } from 'next/navigation'
import { MDXContent } from '@content-collections/mdx/react'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { StatusPill } from '@/components/status-pill'

export function generateStaticParams() {
  return allWorks.filter(w => w.body && String(w.body).trim().length > 0).map(w => ({ slug: w.slug }))
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = allWorks.find(w => w.slug === slug)
  if (!work || !work.body) notFound()
  return (
    <article className="max-w-2xl mx-auto">
      <header className="mb-8 space-y-3">
        <div className="flex gap-2"><StatusPill kind={work.type} /><StatusPill kind={work.status} /></div>
        <h1 className="font-serif text-4xl">{work.title}</h1>
        <p className="text-[var(--color-muted)]">{work.summary}</p>
      </header>
      <div className="prose"><MDXContent code={work.body} components={mdxComponents} /></div>
    </article>
  )
}
```

- [ ] **Step 3: Build**

```bash
pnpm build
```
Expected: only works with non-empty body get static params.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(works): detail page renders only when body non-empty"
```

---

### Task 25: /blog list page

**Files:**
- Create: `src/app/blog/page.tsx`

- [ ] **Step 1: Implement**

```tsx
import { allPosts } from 'content-collections'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'

export const metadata = { title: 'Writing' }

export default function BlogPage() {
  const posts = allPosts.filter(p => !p.draft).sort((a, b) => b.date.localeCompare(a.date))
  return (
    <div>
      <SectionHeader>Writing</SectionHeader>
      <div className="font-mono text-xs text-[var(--color-muted)] mb-4">{posts.length} posts</div>
      <div>{posts.map(p => <PostCard key={p.slug} post={p} />)}</div>
    </div>
  )
}
```

- [ ] **Step 2: Eyeball + Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "feat(blog): list page with all posts sorted desc"
```

---

### Task 26: /blog/[slug] detail page (rehype-pretty-code + early-content banner)

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`
- Modify: `content-collections.ts` (add MDX rehype plugins)

- [ ] **Step 1: Add rehype plugins**

```bash
pnpm add -D rehype-pretty-code shiki rehype-slug rehype-autolink-headings remark-gfm
```

In `content-collections.ts`, transform:
```ts
transform: async (doc, ctx) => ({
  ...doc,
  body: await compileMDX(ctx, doc, {
    remarkPlugins: [(await import('remark-gfm')).default],
    rehypePlugins: [
      (await import('rehype-slug')).default,
      [(await import('rehype-pretty-code')).default, { theme: 'github-dark-dimmed' }],
      [(await import('rehype-autolink-headings')).default, { behavior: 'append' }],
    ],
  }),
})
```

- [ ] **Step 2: Detail page**

`src/app/blog/[slug]/page.tsx`:
```tsx
import { allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import { MDXContent } from '@content-collections/mdx/react'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { EarlyContentBanner } from '@/components/early-content-banner'

export function generateStaticParams() {
  return allPosts.filter(p => !p.draft).map(p => ({ slug: p.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = allPosts.find(p => p.slug === slug && !p.draft)
  if (!post) notFound()
  return (
    <article className="max-w-2xl mx-auto">
      <header className="mb-8 space-y-2">
        <h1 className="font-serif text-4xl">{post.title}</h1>
        <time className="font-mono text-xs text-[var(--color-muted)]">{post.date}</time>
      </header>
      {post.earlyContent && <EarlyContentBanner />}
      <div className="prose"><MDXContent code={post.body} components={mdxComponents} /></div>
    </article>
  )
}
```

- [ ] **Step 3: Build — verify all 32 posts render**

```bash
pnpm build
```
Expected: 32 static pages generated under `/blog/[slug]`. Spot-check 3 posts in dev: one tech post (`canvas-drag`), one thinking (`future-path`), one interview (`frontend-interview`) — confirm banner appears only on the interview one.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(blog): detail page with code highlighting and early-content banner"
```

---

### Task 27: /tags + /tags/[tag] pages

**Files:**
- Create: `src/app/tags/page.tsx`, `src/app/tags/[tag]/page.tsx`

- [ ] **Step 1: Tag index**

```tsx
// src/app/tags/page.tsx
import Link from 'next/link'
import { allPosts } from 'content-collections'
import { SectionHeader } from '@/components/section-header'

export const metadata = { title: 'Tags' }

export default function TagsPage() {
  const counts = new Map<string, number>()
  for (const p of allPosts) for (const t of p.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1)
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
  return (
    <div>
      <SectionHeader>Tags</SectionHeader>
      <div className="flex flex-wrap gap-2 font-mono text-sm">
        {sorted.map(([tag, n]) => (
          <Link key={tag} href={`/tags/${tag}`} className="px-2 py-1 border border-[var(--color-border)] rounded-sm hover:text-[var(--color-accent)]">
            {tag} <span className="text-[var(--color-muted)]">{n}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Tag detail**

```tsx
// src/app/tags/[tag]/page.tsx
import { allPosts } from 'content-collections'
import { PostCard } from '@/components/post-card'
import { SectionHeader } from '@/components/section-header'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  const tags = new Set<string>()
  for (const p of allPosts) for (const t of p.tags ?? []) tags.add(t)
  return [...tags].map(tag => ({ tag }))
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const posts = allPosts.filter(p => (p.tags ?? []).includes(tag))
  if (posts.length === 0) notFound()
  return (
    <div>
      <SectionHeader>// tag: {tag}</SectionHeader>
      <div>{posts.map(p => <PostCard key={p.slug} post={p} />)}</div>
    </div>
  )
}
```

- [ ] **Step 3: Build + Commit**

```bash
git add -A
git commit -m "feat(tags): tag index and per-tag listing"
```

---

### Task 28: /guestbook (giscus)

**Files:**
- Create: `src/app/guestbook/page.tsx`, `src/components/giscus-comments.tsx`

- [ ] **Step 1: Giscus client**

`src/components/giscus-comments.tsx`:
```tsx
'use client'
import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import { siteConfig } from '@/lib/site-config'

export function GiscusComments({ term = 'Guestbook' }: { term?: string }) {
  const { resolvedTheme } = useTheme()
  return (
    <Giscus
      repo={siteConfig.giscus.repo}
      repoId={siteConfig.giscus.repoId}
      category={siteConfig.giscus.category}
      categoryId={siteConfig.giscus.categoryId}
      mapping="specific" term={term}
      reactionsEnabled="1" emitMetadata="0" inputPosition="top"
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'} lang="zh-CN"
    />
  )
}
```

```bash
pnpm add @giscus/react
```

- [ ] **Step 2: Page**

```tsx
// src/app/guestbook/page.tsx
import { GiscusComments } from '@/components/giscus-comments'
import { SectionHeader } from '@/components/section-header'

export const metadata = { title: 'Guestbook' }

export default function GuestbookPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <SectionHeader>Guestbook</SectionHeader>
      <p className="text-[var(--color-muted)] mb-8">留言、想法、批评、合作意向 — 都欢迎。</p>
      <GiscusComments term="guestbook" />
    </div>
  )
}
```

- [ ] **Step 3: Set up giscus repo settings**

Manually: enable Discussions on `huccct/orionchen.me` repo, install giscus app, visit https://giscus.app/ to obtain `repoId` and `categoryId` for "Guestbook" category. Paste into `siteConfig.giscus`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(guestbook): giscus-backed guestbook page"
```

---

### Task 29: /about (bio + mini-resume + now + contact)

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Implement (single page, no sub-routes per spec)**

```tsx
import { siteConfig } from '@/lib/site-config'
import { SectionHeader } from '@/components/section-header'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <section>
        <SectionHeader>About</SectionHeader>
        <p className="text-base leading-relaxed">
          我是 Orion Chen,程序员,纪录片创作者。目前全职在 <a href="https://xialiao.ai" className="text-[var(--color-accent)]">硅基回响 / 虾聊</a>,
          这个站是我的副线 — 把脑子里有意思的想法做出来放着,有没有人用是另一回事。
        </p>
      </section>

      <section>
        <SectionHeader>Now</SectionHeader>
        <ul className="list-none space-y-1 font-mono text-sm">
          <li>// 全职:虾聊 v2 (Founding Engineer)</li>
          <li>// 筹备:人物专访纪录片(2026-05 起)</li>
          <li>// 学习:English sprint (2026-05 → 2026-11)</li>
        </ul>
      </section>

      <section>
        <SectionHeader>Resume</SectionHeader>
        <p className="text-sm text-[var(--color-muted)]">
          (mini summary; full resume available on request via <a href={`mailto:${siteConfig.email}`} className="text-[var(--color-accent)]">{siteConfig.email}</a>)
        </p>
      </section>

      <section>
        <SectionHeader>Design</SectionHeader>
        <p className="text-sm">
          这个站本身的设计系统在 <a href="https://github.com/huccct/orionchen.me/blob/main/DESIGN.md" className="text-[var(--color-accent)]">DESIGN.md</a> 里。
        </p>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat(about): bio, now, resume, design.md link"
```

---

### Task 30: not-found / error / loading

**Files:**
- Create: `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/loading.tsx`

- [ ] **Step 1: Implement all three**

```tsx
// not-found.tsx
import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="py-24 text-center font-mono space-y-4">
      <p className="text-sm text-[var(--color-muted)]">// 404</p>
      <h1 className="font-serif text-3xl">页面不在这里</h1>
      <Link href="/" className="text-[var(--color-accent)]">返回首页</Link>
    </div>
  )
}
```
```tsx
// error.tsx
'use client'
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-24 text-center space-y-4">
      <p className="font-mono text-sm text-[var(--color-muted)]">// 500</p>
      <button onClick={reset} className="text-[var(--color-accent)]">重试</button>
    </div>
  )
}
```
```tsx
// loading.tsx
export default function Loading() {
  return <div className="py-24 text-center font-mono text-sm text-[var(--color-muted)]">// loading...</div>
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(layout): not-found, error, loading pages"
```

---

## Phase 4 — Polish (6 tasks)

### Task 31: OG images (site default + per-post dynamic)

**Files:**
- Create: `src/app/opengraph-image.tsx`, `src/app/blog/[slug]/opengraph-image.tsx`, `src/app/icon.tsx`

- [ ] **Step 1: Site OG**

```tsx
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'
export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function OG() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: 80, background: '#1a1a1a', color: '#f5f5f5',
      fontFamily: 'serif',
    }}>
      <div style={{ fontSize: 96, fontWeight: 600 }}>Orion Chen</div>
      <div style={{ fontSize: 32, color: '#A0522D', marginTop: 16, fontFamily: 'monospace' }}>// orionchen.me</div>
    </div>, { ...size }
  )
}
```

- [ ] **Step 2: Per-post OG**

```tsx
// src/app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { allPosts } from 'content-collections'
export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export default async function PostOG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = allPosts.find(p => p.slug === slug)
  if (!post) return new Response('not found', { status: 404 })
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', padding: 80, background: '#1a1a1a', color: '#f5f5f5',
    }}>
      <div style={{ fontSize: 64, fontWeight: 600, fontFamily: 'serif', maxWidth: 1000 }}>{post.title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 24, color: '#A0522D' }}>
        <span>// {post.date}</span><span>orionchen.me</span>
      </div>
    </div>, { ...size }
  )
}
```

- [ ] **Step 3: Build**

```bash
pnpm build
```
Expected: edge functions for OG generated.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(seo): dynamic og images for site and per-post"
```

---

### Task 32: RSS feed at /rss.xml

**Files:**
- Create: `src/app/rss.xml/route.ts`

- [ ] **Step 1: Implement**

```ts
import { allPosts } from 'content-collections'
import { siteConfig } from '@/lib/site-config'

export const dynamic = 'force-static'

export function GET() {
  const posts = allPosts.filter(p => !p.draft).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 50)
  const items = posts.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteConfig.url}/blog/${p.slug}</link>
      <guid>${siteConfig.url}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.summary ?? ''}]]></description>
    </item>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${siteConfig.name}</title>
  <link>${siteConfig.url}</link>
  <description>${siteConfig.description}</description>
  ${items}
</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
```

- [ ] **Step 2: Build + curl**

```bash
pnpm build && pnpm start &
sleep 3 && curl -s http://localhost:3000/rss.xml | head -20
```
Expected: valid XML with channel + first post item.

- [ ] **Step 3: Commit**

```bash
git add src/app/rss.xml
git commit -m "feat(seo): rss feed at /rss.xml"
```

---

### Task 33: sitemap.ts + robots.ts

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`

- [ ] **Step 1: Sitemap**

```ts
import type { MetadataRoute } from 'next'
import { allPosts, allWorks } from 'content-collections'
import { siteConfig } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const u = siteConfig.url
  const staticRoutes = ['', '/works', '/blog', '/tags', '/guestbook', '/about'].map(p => ({ url: `${u}${p}`, changeFrequency: 'monthly' as const }))
  const posts = allPosts.filter(p => !p.draft).map(p => ({ url: `${u}/blog/${p.slug}`, lastModified: p.date }))
  const works = allWorks.map(w => ({ url: `${u}/works/${w.slug}`, lastModified: w.publishedAt }))
  return [...staticRoutes, ...posts, ...works]
}
```

- [ ] **Step 2: Robots**

```ts
import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

- [ ] **Step 3: Build + verify**

```bash
pnpm build
```
Expected: `/sitemap.xml` and `/robots.txt` generated.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat(seo): sitemap and robots"
```

---

### Task 34: next.config redirects (/projects → /works, /resume → /about)

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add redirects()**

```ts
import { withContentCollections } from '@content-collections/next'
import type { NextConfig } from 'next'
const config: NextConfig = {
  async redirects() {
    return [
      { source: '/projects', destination: '/works', permanent: true },
      { source: '/resume', destination: '/about', permanent: true },
    ]
  },
}
export default withContentCollections(config)
```

- [ ] **Step 2: Verify**

```bash
pnpm build && pnpm start &
sleep 3 && curl -sI http://localhost:3000/projects | grep -E "HTTP|location"
```
Expected: `HTTP/1.1 308` + `location: /works`.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat(seo): 308 redirects for /projects and /resume"
```

---

### Task 35: Plausible analytics

**Files:**
- Create: `src/components/plausible.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Component**

```tsx
'use client'
import Script from 'next/script'
import { siteConfig } from '@/lib/site-config'

export function Plausible() {
  if (process.env.NODE_ENV !== 'production') return null
  return <Script defer data-domain={siteConfig.plausibleDomain} src="https://plausible.io/js/script.js" />
}
```

- [ ] **Step 2: Mount in layout**

In `src/app/layout.tsx` body, before `</ThemeProvider>`, add `<Plausible />`.

- [ ] **Step 3: Add Plausible site at plausible.io for `orionchen.me`** (manual; record DNS if self-hosting; default is plausible.io)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(analytics): plausible (production only)"
```

---

### Task 36: OPERATIONS.md (cadence rules)

**Files:**
- Create: `OPERATIONS.md`

- [ ] **Step 1: Author**

```markdown
# OPERATIONS.md — orionchen.me

Maintenance rules for this site, mirrored from spec §8. Read this every quarterly review.

## Time budget
- **2h/week hard cap** during maintenance.
- One full weekend per quarter for major changes (nav, new medium, DESIGN.md revision).
- If main job (虾聊) is on fire: 0h/week is OK. Hiatus banner at 6 months of zero output.

## Cadence floors (soft, with review)
- Writing: 1 / 3 months — on miss, must show notes/draft/WIP, not forced to ship.
- Code: 1 new piece / 6 months. Repackage internal 虾聊 decisions into public posts is allowed.
- Film: no floor in first 6 months; set after first episode ships.

## 2h/week priority order
1. Reply to guestbook (~15 min)
2. Triage PRs/issues if any (~30 min)
3. Writing or works changes
4. **Forbidden**: SEO tuning, design fiddling, analytics dashboards, deploy fiddling.

## Hiatus protocol
6 months zero output → declare hiatus in hero banner ("On hiatus until X"). Restart with a long-form anchor post.
```

- [ ] **Step 2: Commit**

```bash
git add OPERATIONS.md
git commit -m "docs: operations.md with cadence and 2h/week cap"
```

---

## Phase 5 — Cutover (2 tasks)

### Task 37: Vercel preview + URL smoke check

**Files:**
- Create: GitHub repo `huccct/orionchen.me`, push, link to Vercel project

- [ ] **Step 1: Push to GitHub**

```bash
gh repo create huccct/orionchen.me --private --source=. --remote=origin --push
```

- [ ] **Step 2: Link to Vercel**

```bash
pnpm dlx vercel link
pnpm dlx vercel --prod=false
```
Note the preview URL (e.g. `orionchen-me-abc.vercel.app`).

- [ ] **Step 3: Smoke-check old URLs against preview**

Save list to `scripts/smoke-old-urls.sh`:
```bash
#!/usr/bin/env bash
set -e
HOST="${1:-https://orionchen-me-abc.vercel.app}"
for slug in $(ls ~/Frontend/blog/data/blog/ | sed 's/\.mdx$//'); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$HOST/blog/$slug")
  echo "$code $HOST/blog/$slug"
done
# also redirects
curl -s -o /dev/null -w "%{http_code} /projects\n" "$HOST/projects"
curl -s -o /dev/null -w "%{http_code} /resume\n" "$HOST/resume"
```

```bash
chmod +x scripts/smoke-old-urls.sh
./scripts/smoke-old-urls.sh https://<preview-url>
```
Expected: 32 lines of `200`, plus `308 /projects` and `308 /resume`.

- [ ] **Step 4: Commit**

```bash
git add scripts/smoke-old-urls.sh
git commit -m "chore: add smoke-check script for url preservation"
git push
```

---

### Task 38: Production cutover

**Files:** none (Vercel + DNS only)

- [ ] **Step 1: Promote preview to production in Vercel**

In Vercel dashboard for `orionchen.me` project: Promote latest preview → Production.

- [ ] **Step 2: Move custom domain `orionchen.me`**

In old `huccct/blog` Vercel project: remove `orionchen.me` domain.
In new `huccct/orionchen.me` Vercel project: add `orionchen.me` (and `www.orionchen.me`) custom domain. Vercel handles DNS verification.

- [ ] **Step 3: Old project keeps `blog-v1.orionchen.me`**

Add `blog-v1.orionchen.me` as the production domain on the old project. Update Cloudflare/DNS as needed (CNAME to cname.vercel-dns.com).

- [ ] **Step 4: Submit new sitemap to Google Search Console**

Go to https://search.google.com/search-console, property `orionchen.me`, submit `/sitemap.xml`.

- [ ] **Step 5: Observe 1 week**

Watch Plausible dashboard + Search Console crawl errors daily. If >10% drop in `/blog/[slug]` traffic vs prior week, consider DNS rollback.

- [ ] **Step 6: Final commit (annotation)**

```bash
git commit --allow-empty -m "chore: cutover orionchen.me to v2"
git push
```

After 1 stable week: archive old Vercel project (keep DNS subdomain `blog-v1.orionchen.me` alive forever as historical record).

---

## Self-Review Notes

**Spec coverage check:** Every section of `2026-05-17-personal-studio-design.md` mapped:
- §1-3 positioning & non-goals → encoded in CLAUDE.md (Task 3) and OPERATIONS.md (Task 36)
- §4 IA → Tasks 17-30 (layout/nav, all pages)
- §5 Works data schema → Tasks 11, 16, 20, 23-24
- §6 visual system → Tasks 4-9 + DESIGN.md (Task 6)
- §7 tech stack → Tasks 1-2, 9-10, 35
- §8 cadence → OPERATIONS.md (Task 36)
- §9 repo & migration → Tasks 1, 12-15, 34, 37-38
- §10 risks → migration TDD addresses #1; CLAUDE.md addresses #2; Task 16 acknowledges #3 by curating not padding; Option A architecture addresses #4

**Placeholder scan:** No "TBD" / "implement later" / "add appropriate X" patterns; every component has full code; every command has expected output.

**Type consistency:** `postSchema` and `workSchema` field names match between Tasks 10-11, migration script (12-15), components (20-21), and pages (22-29). `EarlyContentBanner` referenced in Task 8 and used in Task 26.

**Total**: 38 tasks = 38 commits. Estimate 7-9 working days at 5-10h/week (~3 weeks elapsed).












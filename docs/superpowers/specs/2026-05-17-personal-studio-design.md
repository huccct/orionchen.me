# orionchen.me — Personal Studio Design Spec

- **Date**: 2026-05-17
- **Author**: huccct (Orion Chen)
- **Status**: Approved (brainstorming complete, ready for implementation plan)
- **Scope**: Rewrite of `~/Frontend/blog` (https://orionchen.me) into a personal studio site
- **Note**: This spec lives in the orionchen.me repo. The original lived in the v1 huccct/blog repo.

---

## 1. Context

The current site at `orionchen.me` is a `tailwind-nextjs-starter-blog` (Next 12, contentlayer 0.2, React 17), with ~20 mdx posts plus `/projects`, `/resume`, `/about`. Both Next 12 and contentlayer are end-of-life.

The user is full-time at 硅基回响 (working on 虾聊). This site is **not** a side business or commercial venture — it is a personal creative space, born from the urge to "make interesting ideas, regardless of whether anyone uses them."

Reference shape: `lovstudio.ai` (手工川工作室). However, lovstudio is a full-time founder's commercial IP play. This site **borrows the skeleton** (Hero / Works / Writing / Guestbook) but **rejects the commercial layer** (no Pro skills, no courses, no Bastions, no investor circle).

Closer mental models: `leerob.com`, `simonwillison.net`, `overreacted.io`, `karpathy.ai` — main-job engineers whose personal sites are sediment, not income.

## 2. Non-Goals (explicitly NOT doing)

To prevent drift back into the lovstudio-style commercial track, the following are out of scope, now and likely forever:

- Pro / paid skills, paywalls, memberships
- Courses, training, cohorts
- Offline events, "Bastions", co-working partnerships
- Investor / accelerator / media partner showcase
- Aggressive growth instrumentation, A/B testing, conversion funnels
- Newsletter as a primary product (giscus comments are enough)
- "Site Agent" chatbot widget
- GitHub real-time activity feed ("Building" section in lovstudio)
- Sponsorship, ads
- A standalone studio brand (no `lovstudio`-equivalent name; the brand is the person)

## 3. Positioning

> `orionchen.me` is huccct (Orion Chen)'s personal works space. It is not a studio, not a business.

Key constraints:

- **Main job**: 硅基回响 / 虾聊 is full-time. This site lives on **5–10h/week during build**, **2h/week hard cap during maintenance**.
- **Driver**: ship interesting ideas; whether anyone uses them is irrelevant.
- **Side effect (not goal)**: occasionally someone remembers the person — but the site is not designed for that.
- **The creator is multi-medium**: code, **film (documentary interviews, in preparation as of 2026-05)**, writing. The IA must accommodate all three from day one.

## 4. Information Architecture

### 4.1 Top-level navigation

Four items: `Works · Writing · Guestbook · About`

`Skills` is **not** top-level — Claude Code skills live as a filter under `/works`.

### 4.2 Homepage sections (top to bottom)

1. **Hero** — name, one-line positioning that signals multi-medium identity. **No vanity stats** (no "451 fellow travelers" style).
2. **Works** — featured 4–6 items, mixed across mediums (code / film / writing), no medium grouping. Sorted by `publishedAt` desc among `featured: true`.
3. **Writing** — latest 3–5 posts, links to `/blog`.
4. **Guestbook** — giscus inline.

Explicitly **dropped**: Building (GitHub feed), Circle (tools/people/projects), Bastions, Site Agent, Featured Skills strip.

### 4.3 URL structure

| URL | Purpose |
|---|---|
| `/` | Homepage |
| `/works` | All works, with `?type=code\|film\|writing` filter tabs |
| `/works/[slug]` | Optional detail page (renders only when MDX body is non-empty) |
| `/blog` | Existing posts archive — **path preserved for SEO** |
| `/blog/[slug]` | Existing post — **path preserved for SEO** |
| `/tags/[tag]` | Existing tag page — preserved |
| `/guestbook` | Comments via giscus |
| `/about` | Bio + mini-resume + now + contact (single page, not split) |

Redirects:

- `/projects` → 301 → `/works`
- `/resume` → 301 → `/about`

### 4.4 Film integration depth: **Option A** (cards only)

Each film is a Work card with poster, title, one-line summary, and external link to YouTube / Bilibili / 小宇宙. **No in-site player in v1.** Upgrade to embedded player only when there is real content demanding it.

## 5. Data Schema — `content/works/*.mdx`

```ts
{
  // required
  slug: string
  title: string
  summary: string
  type: 'code' | 'film' | 'writing'
  status: 'wip' | 'live' | 'archived'
  publishedAt: string  // YYYY-MM-DD
  cover: string        // /images/works/<slug>.jpg

  // optional
  featured?: boolean   // homepage eligibility
  updatedAt?: string
  tags?: string[]

  links?: {
    repo?: string
    demo?: string
    youtube?: string
    bilibili?: string
    xiaoyuzhou?: string
    article?: string   // e.g. "/blog/movorca"
    other?: { label: string; url: string }[]
  }

  meta?: {
    // code
    stars?: number      // hand-filled, quarterly refresh; no GitHub API in v1
    language?: string

    // film
    runtime?: string    // "32 min"
    guests?: string[]
    episode?: string    // "EP01"

    // writing (only for hand-picked features that also live in /works)
    wordCount?: number
  }
}
```

**Body behavior**:
- Empty body → card click goes to first available external link, priority `demo > repo > youtube > bilibili > article`.
- Non-empty body → renders `/works/[slug]` detail page.

**Listing**:
- Homepage Works: `featured === true`, sorted `publishedAt` desc, max 6.
- `/works`: all items, with top tabs `All / Code / Film / Writing` (4 tabs).

## 6. Visual System

> **Direction**: engineer's restraint × documentary storytelling. **Not** a fork of lovstudio's purple cyber palette.

| Token | Value |
|---|---|
| Background (dark) | `zinc-950` (slightly warm, not pure black) |
| Foreground (dark) | near-white grays |
| Accent | **sienna `#A0522D`** — film/old-photo warmth, avoids common blue/purple |
| Heading typeface | **Newsreader** (English serif) + **Noto Serif SC** (Chinese serif) — "documentary opening" feel |
| Body sans | **Geist Sans** |
| Mono | **Geist Mono** — used for nav, tags, numerics, `//` comment decorations |
| Decoration | `// Section Name` headers, `─────` dividers, status pills (`code` / `film` / `wip` / `live`) |
| Density | high — card gap 16–24px, line-height 1.6–1.7, type scale ~5 steps (14/16/20/32/64) |
| Animation | minimal — hover + first-screen fade-in only. **No** scroll parallax, mouse trail, or particle background. |
| Radius | up to `rounded-md` only |
| Shadow | none on default cards; subtle on hover only |

**Authoring**: This visual system will be encoded as a `DESIGN.md` file at the repo root, following the [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) Stitch format (9 sections: theme, color, typography, components, layout, depth, do/don't, responsive, agent prompts). **Not copied from any existing brand template** — written from scratch, using `Linear` and `WIRED` as format references only. The DESIGN.md is itself a v1 deliverable and will be linked from `/about`.

## 7. Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 15** (App Router, RSC, streaming, metadata API) |
| Node | 22 LTS |
| Package manager | pnpm |
| Styling | **Tailwind v4** |
| UI primitives | **shadcn/ui** — install on demand: `button / card / dialog / tooltip / tabs` only |
| Fonts | `next/font/google` for Geist (Sans + Mono) + Newsreader + Noto Serif SC |
| Content layer | **content-collections** (TypeScript-native, contentlayer's spiritual successor, Next 15 compatible) |
| MDX | `@content-collections/mdx` + `rehype-pretty-code` (Shiki) + `rehype-slug` + `rehype-autolink-headings` + `remark-gfm` |
| Icons | **lucide-react** (no emojis in UI per existing project rule) |
| Comments | **giscus** (carry over from old site, GitHub Discussions backend) |
| Theme | **next-themes** (dark / light / system) |
| OG images | **`@vercel/og`** — dynamic per post |
| RSS / sitemap | Next 15 metadata API + ported scripts from old site |
| Analytics | **Plausible** |
| Deployment | Vercel |
| Lint / Format | `eslint-config-next` + `prettier` (not antfu — that's for movorca / 虾聊) |
| TypeScript | strict |
| i18n | **Not in v1.** Single language (Chinese-primary, English allowed in posts where the author chose to write in English). Add only when there is concrete English audience demand. |

## 8. Cadence & Content Mechanics

### 8.1 Time budget

- **Build period (Phase 0–5)**: 5–10h/week, 3 weeks to launch. Weekends primary, weeknight evenings supplemental.
- **Maintenance**: **2h/week hard cap.** Crossing the line stops work; main job (虾聊) takes priority.
- **Exception**: one full-weekend quarterly review allowed for major changes (nav restructure, new medium, DESIGN.md revision).

### 8.2 Minimum publishing cadence — soft floors with review

| Medium | Floor | Action on miss |
|---|---|---|
| Writing | 1 post / 3 months | Review state; not forced to ship — but must show evidence of progress (notes, draft, WIP) |
| Code | 1 new piece / 6 months (skill / demo / toy is fine) | Same review rule; can repackage an internal 虾聊 decision into a public post |
| Film | none yet (not started) | Set after first film ships; no floor in first 6 months |

### 8.3 Maintenance hour priority (the 2h/week)

In strict order:
1. Reply to guestbook (~15 min)
2. Triage PRs / issues if any (~30 min)
3. Writing or works changes
4. **Forbidden**: SEO tuning, design fiddling, analytics dashboards, deploy fiddling — these are time sinks that simulate creation.

### 8.4 Hiatus protocol

If 6 months pass with zero output: declare hiatus publicly via a banner in the hero ("On hiatus until X"). Pretending to be active is worse than admitting a pause. Restart with a long-form anchor post.

## 9. Repository & Migration

### 9.1 Repo

- **New repo**: `huccct/orionchen.me` (repo name = domain)
- **Old repo**: `huccct/blog` — **kept as-is**, no rename, no archive flag, no banner. Just stops receiving pushes.
- **Vercel**: domain `orionchen.me` migrates to new project; old project keeps `blog-v1.orionchen.me` for one-week observation, then archived.

### 9.2 Existing content handling

| Class | Count | Action |
|---|---|---|
| Tech posts (grid/flex/canvas/http/router) | ~10 | Migrate all |
| Career/thinking posts (future-path, financial-independence, etc.) | ~5 | Migrate all |
| Interview prep posts | 2 | Migrate, add "early content" banner |
| `projectsData.ts` | — | Rebuild as `content/works/*.mdx` |
| `resume.tsx` | — | Merge into `/about` |
| `public/static/images/` | — | Move to new path; redirects if needed |

### 9.3 Migration script

`scripts/migrate-blog-v1.ts`, one-shot:
1. Read old `data/blog/*.mdx` frontmatter
2. Field mapping (`summary` → `summary`, `tags` → `tags`, add `type: 'writing'`, add `status: 'live'`)
3. Write to new repo's `content/posts/*.mdx`
4. Image path rewrite if needed
5. Output report: N succeeded / X failed / warnings

### 9.4 SEO preservation

- All `/blog/[slug]` and `/tags/[tag]` paths preserved exactly.
- 301 redirects for `/projects` and `/resume` only.
- Sitemap regenerated; submit to Google Search Console post-launch.

### 9.5 Cutover sequence (Phase 5)

Each step reversible:
1. Deploy new repo to Vercel preview domain (`orionchen-me-v2.vercel.app`).
2. Run a 200-status check across all old URLs (curl list).
3. Switch `orionchen.me` DNS / Vercel domain to new project.
4. Old Vercel project gets `blog-v1.orionchen.me` as production domain.
5. One-week observation. If SEO ranking or traffic regresses materially, revert DNS.
6. After one stable week, archive old Vercel project.

## 10. Risks & Open Items

### Known risks

1. **content-collections frontmatter incompatibility** with old contentlayer schema — migration script must be written and tested early in Phase 2, not as a Phase 5 afterthought.
2. **Time budget overrun** — building a Hero / Works / DESIGN.md trio always feels "almost done"; the 2h/week maintenance cap must be enforced from day one of post-launch.
3. **Empty-state on launch** — `/works` may have only 3–4 items at launch (Movorca skill, agent-flow-viz, virtual-pet, etc.); resist the urge to pad with weak entries.
4. **Multi-medium IA on day one** — committing to film as a top-class medium before any film ships could feel premature; mitigated by Option A (cards only, external links) so empty film state is just "no cards yet" rather than a broken player.

### Open / deferred

- **i18n**: deferred until concrete English audience signals. Re-evaluate annually.
- **GitHub stars auto-refresh**: deferred; manual quarterly update is fine for v1.
- **Film embedded player**: deferred until first film exists.
- **Newsletter / RSS-to-email**: not planned, but technical RSS feed is preserved.

## 11. References

- [lovstudio.ai](https://lovstudio.ai/) — skeleton reference (commercial layer rejected)
- [leerob.com](https://leerob.com), [simonwillison.net](https://simonwillison.net), [overreacted.io](https://overreacted.io), [karpathy.ai](https://karpathy.ai) — main-job engineer IP archetypes
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — DESIGN.md format authority
- [content-collections](https://www.content-collections.dev/) — content layer choice
- [next-intl](https://next-intl-docs.vercel.app/) — deferred i18n option

---

## Appendix A — Phase Summary (high-level; full plan via writing-plans skill)

| Phase | Duration | Output |
|---|---|---|
| 0. Stack lock-in | 0.5 day | Final stack decisions, `DESIGN.md` skeleton |
| 1. Scaffold | 1 day | New repo, layout, theme, design tokens, CLAUDE.md |
| 2. Content migration | 1–2 days | 20+ posts ported; redirects in place |
| 3. Pages | 3–4 days | Hero, Works, Writing strip, Guestbook, About |
| 4. Polish | 1 day | OG images, RSS/sitemap, Plausible, 404/loading/error |
| 5. Cutover | 0.5 day | DNS switch, observation, old-repo archive |

**Total estimate**: 7–9 working days, ~3 weeks elapsed at 5–10h/week.

The detailed plan with per-task commit boundaries will be produced by the `superpowers:writing-plans` skill in a follow-up step.

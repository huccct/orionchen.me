# DESIGN.md - orionchen.me

## 1. Visual Theme & Atmosphere

orionchen.me should feel like an engineer's notebook edited with documentary restraint:
quiet, dense, text-led, and warm at the edges. The site is a personal works space for code,
film, and writing, not a studio brand or conversion funnel.

The visual mood is warm zinc, paper-like light mode, near-black dark mode, and a sienna
accent that suggests old photos, field notes, and film contact sheets. Motion is sparse:
first-screen fade-in, hover color changes, and small state transitions only.

## 2. Color Palette & Roles

| Token                 | Value                                   | Role                              |
| --------------------- | --------------------------------------- | --------------------------------- |
| `--color-bg`          | `oklch(0.985 0 0)` / `#fafafa`          | Default light page background     |
| `--color-bg-dark`     | `oklch(0.18 0.005 60)`                  | Warm zinc dark background         |
| `--color-fg`          | `oklch(0.18 0.005 60)`                  | Primary light text                |
| `--color-fg-dark`     | `oklch(0.96 0 0)`                       | Primary dark text                 |
| `--color-muted`       | `oklch(0.55 0.005 60)`                  | Secondary text, timestamps, hints |
| `--color-border`      | `oklch(0.92 0.004 60)`                  | Light borders and dividers        |
| `--color-border-dark` | `oklch(0.27 0.005 60)`                  | Dark borders and dividers         |
| `--color-accent`      | `oklch(0.55 0.1 50)` / sienna `#A0522D` | Links, film emphasis, active UI   |

Use the accent with discipline. It should mark decisions, selected states, and important
links, never flood backgrounds.

## 3. Typography Rules

Use Geist Sans for interface and body text, Geist Mono for navigation, tags, dates, counters,
and `//` decorations. Use Newsreader for English display headings and Noto Serif SC for
Chinese display headings. Mixed Chinese and English headings may use a serif stack:
`var(--font-newsreader), var(--font-noto-serif-sc), serif`.

| Level | Size                                             | Use                                   |
| ----- | ------------------------------------------------ | ------------------------------------- |
| Hero  | `4rem` desktop, smaller via breakpoint utilities | Homepage name and one-line identity   |
| H1    | `2rem` to `4rem`                                 | Page title, post title                |
| H2    | `2rem`                                           | Section title, article major heading  |
| H3    | `1.25rem`                                        | Card clusters and subsection headings |
| Lead  | `1.25rem`                                        | Hero support copy and post summary    |
| Body  | `1rem`                                           | Main reading text                     |
| Small | `0.875rem`                                       | Metadata and quiet labels             |
| Mono  | `0.875rem` or smaller                            | Tags, nav, status pills, dates        |

Line height should stay between `1.6` and `1.7` for prose. Letter spacing stays normal.

## 4. Component Stylings

Buttons use shadcn-style variants with square confidence: `rounded-sm` or `rounded-md`, never
larger than 8px. Primary buttons are foreground-filled with accent hover states. Secondary
buttons are bordered, quiet, and monochrome.

Cards are individual repeated items only: work cards, post cards, dialogs, and compact tool
surfaces. Cards use a 1px border, no default shadow, and `shadow-sm` only on hover. Do not put
cards inside cards.

Inputs and textareas use a simple border, transparent background, 44px minimum height, and
accent focus rings. Navigation uses mono labels, generous hit targets, and no pill-shaped
marketing treatment.

States are visible but restrained:

- `wip`: amber border/text
- `live`: emerald border/text
- `archived`: muted border/text
- `film`: sienna border/text
- `code` and `writing`: neutral border/text

## 5. Layout Principles

Pages use a `max-w-5xl` shell with `px-4 md:px-8`. Reading pages use `max-w-2xl` prose for
comfortable line length. Work and post listings use dense grids with 16-24px gaps.

Homepage order is fixed: Hero, Works, Writing, Guestbook. Works are mixed by medium and sorted
by publish date, not grouped into code/film/writing lanes.

Use full-width bands or unframed layouts for sections. Dividers are thin borders or mono
`// Section Name` headers, not decorative blocks.

## 6. Depth & Elevation

Depth is editorial, not ornamental. Default surfaces have no shadow. Hover may add `shadow-sm`
and a subtle border/accent shift. No glass cards, glow, parallax, floating blobs, particle
fields, or gradient backgrounds.

Images should feel inspectable: posters, screenshots, stills, or real covers. Avoid blurred,
dark, atmospheric stock imagery when the user needs to understand the work.

## 7. Do's And Don'ts

Do:

- Preserve `/blog/[slug]` and `/tags/[tag]` URL shapes.
- Keep code, film, and writing first-class from the start.
- Use `//` mono decorations and thin dividers for rhythm.
- Prefer useful density over oversized marketing composition.
- Keep the maintenance surface small.

Don't:

- Add newsletter capture, paywalls, memberships, courses, or conversion funnels.
- Add a chatbot widget, site agent, floating help bubble, or aggressive analytics.
- Use purple cyber palettes, large gradients, rounded-2xl cards, emoji icons, or decorative
  orbs.
- Add heavy animation libraries.
- Add visual features that require weekly maintenance without creating actual work.

## 8. Responsive Behavior

Use one primary breakpoint: `md` at 768px. Mobile layouts are single-column, touch targets are
at least 44px, and nav must remain scannable without text overflow. Desktop layouts may use
two-column grids for Works and compact metadata sidebars for article pages.

Hero type must not scale with viewport width. Use discrete breakpoint sizes and confirm long
Chinese and English text wraps cleanly.

## 9. Agent Prompt Guide

Use these prompts when extending the site:

- "Build a Work card using DESIGN.md tokens, with code/film/writing status pills and no default
  shadow."
- "Create a dense archive section with `// Section Name` decoration, `max-w-5xl` shell, and
  16-24px gaps."
- "Add a page that feels like engineer restraint plus documentary warmth; avoid gradients,
  rounded-2xl, and marketing CTAs."
- "Review this component against DESIGN.md section 7 and remove anything that looks like a
  product landing page."
- "Design an empty state for Works that is honest and quiet, without growth or subscribe copy."

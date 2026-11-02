# NestJS immersive learning topic

Mode: Read. Place interactive MDX topics in an independent Knowledge Maps tab with its own index and topic routes, preserving the site typography and theme. Source: the supplied NestJS discussion, official module/lifecycle documentation, roadmap.sh and Explorable Explanations. No episode inventory.

## Direction contract

THESIS: Navigate a mental model spatially, in the XMind-style canvas the user requested.
OWN-WORLD: Retain the site's font and neutral/moss theme; six restrained branch colors trace relationships.
STORY: Start with the whole map; pan, zoom and collapse branches; inspect one concept; predict and test a scenario; explain or transfer it.
FIRST VIEWPORT: Full viewport with compact toolbar, centered root, bilateral branches and bottom zoom controls. No article header or introductory prose above the map.
FORM: Immersive map workspace at `/learning/nestjs`, with on-demand right inspector. Mobile supports a native concept locator and centered 65% initial zoom below 640px.
FINISH: Validate pan/zoom/collapse, inspector focus, experimental views, mobile and theme, then production build and independent review.

## Confirmed learning contract

The user requires a global problem map; expandable concepts with purpose, rationale, use cases and misconceptions; prediction before manipulation and observation; explanation/debugging/transfer checks rather than completion buttons; and on-demand code/docs. React, Next.js and Agent topics will share this learning method but use topic-appropriate visualization, not a mandatory NestJS tree. Written responses are ephemeral and never graded automatically.

## Navigation and ownership

Knowledge Maps is a top-level tab alongside Writing, Works and Reading. Index: `/learning`; first topic: `/learning/nestjs`. The index has no explanatory footer. Content lives in `src/content/learning`, not blog posts. The topic renderer mounts the workspace directly and passes MDX as on-demand reference prose. Request, module and understanding experiments remain in `nestjs-explorer.tsx`. The original blog URL redirects.

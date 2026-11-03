# NestJS immersive learning topic

Mode: Read. Place interactive MDX topics in an independent Knowledge Maps tab with its own index and topic routes, preserving the site typography and theme. Source: the supplied NestJS discussion, official module/lifecycle documentation, roadmap.sh and Explorable Explanations. No episode inventory.

## Direction contract

THESIS: Navigate a mental model spatially, in the XMind-style canvas the user requested.
OWN-WORLD: Retain the site's font and neutral/moss theme; restrained branch colors trace relationships.
STORY: Start with collapsed domains; pan, zoom and expand domains and groups; inspect one concept; predict and test a scenario; explain or transfer it.
FIRST VIEWPORT: Full viewport with compact toolbar, centered root, bilateral domains, search/locator and bottom zoom controls. No article header or introductory prose above the map.
FORM: Immersive map workspace at `/learning/nestjs`, with on-demand right inspector. Mobile supports a native concept locator and centered 65% initial zoom below 640px.
FINISH: Validate pan/zoom/fit, domain/group collapse, search/locator, inspector focus/return, experimental views, mobile and theme, then production build and independent review.

## Confirmed learning contract

The user requires a global problem map; expandable concepts with purpose, rationale, use cases and misconceptions; prediction before manipulation and observation; explanation/debugging/transfer checks rather than completion buttons; and on-demand code/docs. React, Next.js and Agent topics will share this learning method but use topic-appropriate visualization, not a mandatory NestJS tree. Written responses are ephemeral and never graded automatically.

## Navigation and ownership

Knowledge Maps is a top-level tab alongside Writing, Works and Reading. Index: `/learning`; first topic: `/learning/nestjs`. The index has no explanatory footer. Content lives in `src/content/learning`, not blog posts. The topic renderer mounts the workspace directly and passes MDX as on-demand reference prose. Request, module and understanding experiments remain in `nestjs-explorer.tsx`. The original blog URL redirects.

## Expanded curriculum and shared workspace

The map uses topic → domain → group → concept, covering language/runtime foundations,
organization, request processing, security, data, delivery, advanced dependency/lifecycle
management, API contracts, asynchronous work, realtime communication, microservices,
operations and architectural evolution. The [source-derived full outline](../learning-curriculum.md)
records every domain, group, concept, level and official documentation link. These are
primary-domain learning goals, not exhaustive coverage of every API, adapter or ecosystem
package. Existing concepts remain alongside advanced, engineering and ecosystem entries.

`knowledge-map-workspace.tsx` provides the same camera, inspector and reference behavior
as React. `map-types.ts` defines the model, and `map-layout.ts` calculates bilateral
geometry and bounds from visible content. Domains and groups initially collapse; search
filters the native locator, and choosing a concept opens both ancestors. Preserve zoom
when inspecting; closing returns focus to the last selected node or canvas. Keyboard
arrows pan, plus/minus zoom and `0` fits. Mobile retains the camera controls and scrollable
overlay inspector. Do not fix the number of domains or leaf positions.

`nestjs-map-data.ts` merges the original `nestjs-data.ts` nodes with
`nestjs-curriculum.ts`. `nestjs-mindmap.tsx` configures the shared workspace and retains
request/module models and reflection checks from `nestjs-explorer.tsx`. Code examples
are optional; show a disclosure only when a snippet exists.

Inspector labels distinguish conceptual explanation from related experiment availability.
Organization-domain concepts link to the module experiment; request/security-domain
concepts link to the request experiment. These browser teaching models do not run a
backend, database, broker or distributed system, and do not simulate every topic within
those domains. Other concepts retain explanations, practical goals and official sources
without claiming dedicated advanced experiments. Reflection responses remain only in
the mounted practice view and clear when learning views change, on refresh or on leaving;
no upload, persistence, automatic grading or full-curriculum mastery claim is made.

# Authoring knowledge maps topics

Use an interactive learning topic when readers need to reason about relationships and test
consequences. Keep it in the independent Knowledge Maps tab, with an authored introduction,
scope limits, related writing and source links. The reference implementation is
`src/content/learning/nestjs.mdx` and `src/components/learning/nestjs-mindmap.tsx` (workspace) and `nestjs-explorer.tsx` (experiments).

## Five learning layers

1. **Global problem and relationship map.** Begin with the problems the system solves
   and how its parts connect. Start with the whole map; open concept detail on demand. Explain
   the meaning of edges: the NestJS tree groups knowledge; it does not show execution order.
2. **Concept explanations.** Each node explains its purpose, why it exists, when to
   use it, common pitfalls and upstream/downstream relationships. Link related
   concepts and give an observable ability the reader should gain.
3. **Predict → manipulate → observe.** Ask for a prediction before revealing a trace
   or enabling an experiment. Expose a small number of meaningful variables, explain
   the resulting change and let readers repeat or reverse it. NestJS provides request
   scenarios and a module export/import experiment; both are browser teaching models,
   not a running server or database.
4. **Explain, debug and transfer.** Ask readers to write reasoning, diagnose a failure
   and apply the idea to a new situation. Reveal hints and reasoning criteria on
   demand, then offer a return to the relevant concept. Completion clicks are not
   evidence of understanding. Optional quick questions can supplement these checks.
5. **On-demand code and documentation.** Put illustrative snippets behind disclosures
   and link official references beside the concept. Label omitted context and model
   limitations; snippets must not imply a complete runnable project.

## Add a topic

1. Create a dedicated client component under `src/components/learning/`, with scoped
   styles and topic data. Immersive experiences are selected in `LearningTopicContent`;
   the NestJS workspace receives its MDX reference text as a React node.
2. Create `src/content/learning/<slug>.mdx` using the shared content schema: title,
   date, slug, summary, tags and optional lang/draft. Keep the MDX body as reference
   prose; select and mount the immersive component by slug in
   `src/components/page-content/learning-page-content.tsx`, passing rendered MDX as
   its `reference` prop. The NestJS MDX does not embed `NestjsExplorer`.
   The separate `learning` collection keeps topics out of Writing and its RSS feed.
3. `/learning` and `/en/learning` list topics. `/learning/[slug]` and the English
   counterpart render the interactive detail. Use `src/lib/learning.ts` for queries.
   When no English topics exist, the English index lists Chinese originals with an
   explicit language label; the language toggle falls back to the matching index.
4. Main navigation includes Knowledge Maps beside Writing, Works and Reading.
   Topic pages link back to this index, retain page metadata and join the sitemap.
   The old `/blog/nestjs-mental-model` URL redirects to `/learning/nestjs`.

## Workspace pattern

The NestJS map fills the viewport without article chrome or introductory prose above
it. Drag or scroll to pan; use zoom controls or Ctrl/Command-wheel to zoom, fit the
whole map, restore actual size and collapse or expand branches. The focused canvas
also accepts arrow keys, plus/minus and `0` to fit. Opening the right inspector
preserves zoom; it contains concept explanations, related nodes, code and docs.
The book button opens the MDX reference prose. Below 640px viewport width, the map
starts centered at 65% zoom; a native concept selector supports direct navigation,
and the inspector overlays the canvas with its own scrolling.

The toolbar retains request prediction, module dependency and understanding checks
from `nestjs-explorer.tsx`. Keep these experiments connected to concept inspection.
The `/learning` index remains a quiet topic list without an explanatory footer.

## State and scope

Current experiments and written responses use local React state. Responses remain
only while the practice view is mounted; changing learning views or refreshing clears
them. Nothing is uploaded, persisted or automatically graded. Deterministic prediction
feedback and quick-question explanations are distinct from grading written reasoning.
Keep this limitation visible near the response field.

Reuse the five layers for React, Next.js and Agent topics, but choose the visual form
that reveals the actual mechanism: a render timeline, route/cache flow or tool/state
graph may fit better than a tree. Start with one concrete question and a bounded
experiment, rather than copying every NestJS view.

## Review before shipping

- Verify causal claims and boundary cases against primary documentation; distinguish
  conceptual grouping, dependency direction and execution order.
- Exercise every experiment branch and check that predictions precede observations.
- Check explanation, debugging and transfer prompts require reasoning and expose
  useful criteria without claiming to measure mastery.
- Check keyboard access, visible focus, selected states, result announcements,
  mobile navigation to details, narrow layouts, both themes and reduced motion.
- Verify pan, zoom, branch collapse, inspector focus/return, topic metadata, index
  links, references and existing article layout; run the repository's applicable
  checks and production build.

## React implementation

React implements the same five learning layers through a vertical six-branch map,
concept inspector, prediction-gated render timeline and explanation/debugging/transfer
prompts. The explorer is mounted by the `react` slug and receives MDX reference prose;
its data lives in `react-data.ts`. See [the surface contract](surfaces/react-learning.md).

Compare three direct updates with three updater functions from count = 0 in one
synchronous event. Keep event, queue, calculation and commit distinct, with calculated
state and committed DOM displayed separately. This is a deterministic teaching model,
not realtime React tracing; retain its exclusions and never infer fixed invocation
counts or performance from its four stages.

For React specifically, responses and revealed criteria are held by the parent explorer
and survive learning-view switches while it remains mounted. This differs from the
NestJS practice-view lifetime described above. Refreshing or leaving clears them;
there is no upload, persistence or automatic grading. Mobile stacks map/detail and
experiment/result, focusing and scrolling to a selected concept or started timeline.
Review these transitions and state retention alongside prediction/reset behavior.

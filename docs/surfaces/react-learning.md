# React interactive learning topic

Mode: Read, with interactive learning. A local extension of Knowledge Maps at `/learning/react`; retain the site's neutral/moss palette and existing typography. The topic is Chinese, and the English index can link to the Chinese original with a language label.

## Direction contract

THESIS: Explain why a page changes by connecting component relationships to one observable state update.
OWN-WORLD: Inherit site background, foreground, muted text, border, surface and accent tokens; serif section headings, existing body/UI type and restrained moss selection feedback.
STORY: Pan, zoom and expand knowledge domains and groups; inspect a concept; predict an update; step through its consequences; explain, debug or transfer the idea; consult reference prose as needed.
FIRST VIEWPORT: Compact toolbar, centered React root, bilateral domains initially collapsed, with groups and concept leaves revealed on demand and bottom zoom controls. The map fills the viewport while the site header/footer recede; explanatory prose stays in the on-demand inspector and reference panel.
FORM: The shared NestJS-style map workspace offers three views—知识地图, 渲染实验 and 理解检查—with an index return link, theme control and book-icon reference panel. Below 640px, the map starts centered at 65% zoom, retains pan/zoom controls and provides a native concept locator with a scrollable overlay inspector. The separate experiment layout stacks input and timeline at 760px and below.
FINISH: Check pan/zoom/fit, domain/group collapse, search and concept navigation, inspector focus/return, both update modes, prediction gating, forward/backward/reset, reflection clearing on view changes, narrow-screen navigation, keyboard access and both themes. This document records implementation behavior, not a test result.

## Knowledge map and inspector

The four-level map organizes topic → domain → group → concept. Its curriculum covers language/platform prerequisites, components, props, state, rendering, Effects, sharing, Hooks, forms/Actions, async/concurrency, server boundaries, performance, quality/accessibility and ecosystem decisions. See the source-derived [full outline](../learning-curriculum.md) for every group, concept, level and primary reference. This is bounded coverage of primary domains, not every API or ecosystem library. Curved connectors and restrained branch colors express knowledge grouping, not execution order. Drag or scroll to pan; use controls or Ctrl/Command-wheel to zoom; fit the map, restore actual size and expand/collapse domains and groups. Domains and groups start collapsed; dynamic bilateral geometry follows the visible content. Search filters the locator by concept name, group and role. Opening the inspector preserves zoom. Returning from an activity to a concept expands its domain and group.

Each selected leaf opens a right inspector with its role, purpose, usage scenario, misconception, upstream/downstream context, practical task, related concepts, optional code and official React documentation. Snippets explicitly omit imports and surrounding components. The inspector labels the concept level and experiment availability. Only queue, snapshot, commit, useState and event nodes link to the related update experiment; other concepts explicitly have no dedicated interactive experiment. Code disclosure is optional and appears only when a snippet exists. Keep borders quiet, avoid decorative depth and use accent plus surface/underline feedback for selection.

## Prediction and render timeline

The deterministic teaching model starts at count = 0 and compares three `setCount(count + 1)` calls with three `setCount(n => n + 1)` calls in one synchronous event. Readers choose a predicted final value (0, 1 or 3) before triggering the simulation. Predictions lock once it starts; changing the update mode or selecting “重新预测” clears the prediction and timeline.

Four stages show event trigger, update enqueueing, next-render calculation and DOM commit. Display the calculated value separately from committed DOM text: calculation yields 1 or 3 while DOM remains 0 until commit. Final feedback compares the prediction with the model result; previous/next controls allow inspection without claiming extra real renders.

This is not realtime React tracing or a performance tool. It excludes concurrent interruption, Suspense, Server Components, flushSync and Strict Mode's extra development calls. Four teaching stages do not imply a fixed number of component or updater invocations. Preserve these boundaries in both the experiment note and MDX reference.

## Reflection and reference

Explanation, debugging and transfer prompts require written reasoning. Hints are available on demand; reasoning criteria unlock after a nonblank response, with links back to the relevant concept. No automatic grading or mastery claim is made.

Responses and revealed criteria live only in the current practice view's local React state. Switching reflection prompts retains them while that view remains mounted; changing learning views remounts keyed activities and clears them. Refreshing or leaving also clears them; nothing is uploaded or persisted. The book-icon panel contains MDX reference prose with exploration order, model limits, primary sources and the related NestJS topic.

## Accessibility and source ownership

Use native buttons, selected/expanded states, visible focus, labeled text input and polite result announcements. The focused canvas accepts arrow keys to pan, plus/minus to zoom and `0` to fit. Opening a concept or reference panel focuses the inspector; closing it or pressing Escape returns focus to the last selected node, or the canvas if none exists. Mobile uses the same camera controls plus the concept locator and overlay inspector. Activity views focus their heading; starting the experiment focuses the timeline and scrolls it into view at 760px and below. These transitions do not require animation.

Implementation: `src/components/learning/knowledge-map-workspace.tsx` owns the shared map, camera, inspector and reference behavior used by the React and NestJS wrappers. `react-explorer.tsx` configures React and owns its activities; `react-map-data.ts` combines foundational nodes with `react-curriculum.ts` and supplies domains, groups and inspector notes; `map-types.ts` defines the model and `map-layout.ts` calculates visible geometry; `react-data.ts` supplies topic context, trace and reflections. Reference content lives in `src/content/learning/react.mdx`. `src/components/page-content/learning-page-content.tsx` selects the explorer by slug, passes rendered MDX as `reference` and provides the index's topic preview.

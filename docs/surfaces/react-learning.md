# React interactive learning topic

Mode: Read, with interactive learning. A local extension of Knowledge Maps at `/learning/react`; retain the site's neutral/moss palette and existing typography. The topic is Chinese, and the English index can link to the Chinese original with a language label.

## Direction contract

THESIS: Explain why a page changes by connecting component relationships to one observable state update.
OWN-WORLD: Inherit site background, foreground, muted text, border, surface and accent tokens; serif section headings, existing body/UI type and restrained moss selection feedback.
STORY: Inspect the six knowledge branches; predict an update; step through its consequences; explain, debug or transfer the idea; consult reference prose as needed.
FIRST VIEWPORT: Compact toolbar, one question, vertical six-branch map and adjacent concept inspector. The workspace fills the viewport and owns its scrolling while the site header/footer recede.
FORM: Four views—知识地图, 渲染实验, 理解检查 and 深入资料—with an index return link and theme control. Desktop map and experiment layouts use two columns within a 1200px measure; practice and reference prose use 760px. At 760px and below, columns stack and toolbar navigation scrolls horizontally when needed.
FINISH: Check concept navigation, both update modes, prediction gating, forward/backward/reset, reflection retention, narrow-screen focus/scroll, keyboard access and both themes. This document records implementation behavior, not a test result.

## Knowledge map and inspector

Six vertical branches cover components/JSX, props/composition, state/events, rendering/snapshots, Effects/synchronization and shared state. Connecting rules express knowledge grouping; top-to-bottom reading order is not execution order. This surface has no canvas pan, zoom or branch collapse.

Each selected concept shows a guiding question, explanation, scenario, misconception, practical task, related concepts, an optional code disclosure and official React documentation. Snippets explicitly omit imports and surrounding components. The inspector links onward to the update experiment. Keep borders quiet, avoid decorative depth and use accent plus surface/underline feedback for selection.

## Prediction and render timeline

The deterministic teaching model starts at count = 0 and compares three `setCount(count + 1)` calls with three `setCount(n => n + 1)` calls in one synchronous event. Readers choose a predicted final value (0, 1 or 3) before triggering the simulation. Predictions lock once it starts; changing the update mode or selecting “重新预测” clears the prediction and timeline.

Four stages show event trigger, update enqueueing, next-render calculation and DOM commit. Display the calculated value separately from committed DOM text: calculation yields 1 or 3 while DOM remains 0 until commit. Final feedback compares the prediction with the model result; previous/next controls allow inspection without claiming extra real renders.

This is not realtime React tracing or a performance tool. It excludes concurrent interruption, Suspense, Server Components, flushSync and Strict Mode's extra development calls. Four teaching stages do not imply a fixed number of component or updater invocations. Preserve these boundaries in both the experiment note and MDX reference.

## Reflection and reference

Explanation, debugging and transfer prompts require written reasoning. Hints are available on demand; reasoning criteria unlock after a nonblank response, with links back to the relevant concept. No automatic grading or mastery claim is made.

Responses and revealed criteria live in the parent explorer's local React state, so switching prompts or learning views preserves them during the current mount. Refreshing or leaving clears them; nothing is uploaded or persisted. MDX reference prose provides exploration order, model limits, primary sources and the related NestJS topic.

## Accessibility and source ownership

Use native buttons, `aria-pressed` selected states, visible focus, labeled text input and polite result announcements. Concept selection focuses its inspector; on mobile it also scrolls the detail into view. Starting the experiment focuses the timeline and scrolls it into view on mobile. Switching modes focuses the view heading; returning to a related concept focuses and reveals its inspector. These transitions do not require animation.

Implementation: `src/components/learning/react-explorer.tsx` and its scoped CSS; concept, trace and reflection data: `react-data.ts`; reference content: `src/content/learning/react.mdx`. `src/components/page-content/learning-page-content.tsx` selects the explorer by slug, passes rendered MDX as `reference` and provides the index's six-branch preview. The preview is a compact topic identifier; the detailed surface uses the vertical map described here.

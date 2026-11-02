# Design — Orion Chen

## Direction

A personal, text-first site, inspired by the ease and restraint of antfu.me.
The homepage introduces Orion through real writing, code experiments, film and books.
No town, rooms, decorative objects, game navigation or oversized promotional headings.
Keep the existing handwritten signature as the personal mark; do not copy another author's.

## System

Near-white #fdfdfc, charcoal #353633, secondary text #72756f, subtle borders #e8e9e4,
and restrained moss links #507562. Dark mode uses neutral charcoal and muted green.
Use existing Geist for navigation and introductory prose; existing serif fonts remain
available for long-form article headings. Content measures roughly 660px on the homepage; Writing, Works and Reading share a 1080px outer container with matching
title alignment and header spacing. Article pages may widen for the table of contents. Paragraphs have spacious
line height, natural inline links, and no containing cards.

## Surfaces and interaction

Lightweight header with signature, visible text navigation, locale and theme controls.
Homepage: name, natural introduction with meaningful links, social links, latest writing.
Writing: year-grouped plain links, quiet dates, existing pagination and topic routes.
Archive headers are text-only. Reading shows book recommendations beside real publisher covers.
Animations are brief and restrained: a small homepage entrance and link feedback.
Respect reduced motion, visible keyboard focus, touch targets and mobile wrapping.
Keep published content, locale availability, comments, RSS and existing URL shapes intact.
Retired `/town` and `/en/town` routes redirect to the matching homepage.

## Typography and visual notes

Use the existing Newsreader / Noto Serif SC stack for display titles, archive titles and
article links; retain Geist for body and UI. The homepage name is 48px desktop / 40px mobile.
Home and About show two small, real Vibe experiment captures with direct play links,
unframed captions and complete, uncropped images. No pixel scenes or invented photographs.

Featured experiments: six real Vibe works, with two randomly selected on mount. Session
storage excludes the previous pair on refresh. Full 1280×720 captures preserve the original
16:9 composition with contain sizing and no hover crop; mobile uses a single column. Top navigation contains Writing, Knowledge Maps, Works and Reading;
About and Guestbook remain available in the footer, with Guestbook also in the introduction.

Writing archives now show authored summaries, linked topics, dates and the first local
article illustration where available. Year labels remain small; desktop adds a narrow
sidebar with topic counts and existing book recommendations. Mobile stacks content and
sidebar, preserving pagination. Do not fabricate covers for text-only articles.

Reading uses real book covers, downloaded and optimized as local WebP assets, with
visible recommendation notes and direct book links. Image sources are recorded in
public/images/books/sources.json. Preserve each cover without cropping. Reading and Works
use two columns on desktop and one on narrow screens; work titles and badges stack so
long titles remain readable. Each section has distinct static artwork in the outer margins: home uses contour lines;
writing uses manuscript rules; works uses geometric orbits; reading uses page arcs;
about uses circular compositions; guestbook uses conversation outlines; topics uses
connected index nodes. Article detail backgrounds are quieter. Chinese and English
share the same section artwork. The central text column stays clear. No background
JavaScript, tracking of the pointer, or continuous animation is needed.

## Components

The independent Knowledge Maps tab inherits the site's neutral palette and typography.
Its index uses quiet, fully linked topic rows: a short title, one learning goal, and a theme-aware six-branch diagram preview. No dates, article labels, or explanatory footer. NestJS topic detail is an immersive, full-viewport mind-map
workspace: a central topic, six bilateral branches, curved colored connectors and clickable
concept leaves. The site header/footer recede while the workspace is mounted; a return
link leads to the learning index. A compact toolbar switches between the map and existing
prediction experiments / understanding checks.

Pan the map by dragging or scrolling; zoom with controls or modifier-wheel; fit the map
or restore actual size; expand/collapse branches. A right inspector contains explanations,
related concepts, optional code and official docs. Preserve zoom when opening it. Closing
returns focus to the last selected node, or the canvas if none exists. Below 640px,
the map starts centered at 65% zoom, offers the
same pan/zoom controls and a native concept locator, with a scrollable overlay inspector.
Keep theme controls and keyboard alternatives. Reference prose belongs in the book-icon
panel, not above the map. No decorative motion or prerequisite reading wall.

Future topics reuse the learning method in [the authoring guide](docs/visual-learning.md),
not necessarily the NestJS tree.

### React learning extension

React inherits the neutral/moss tokens, serif section headings and existing body/UI
fonts. Its full-viewport Read surface pairs a vertical six-branch map with a concept
inspector; the update experiment pairs prediction controls with a four-stage timeline.
Use quiet rules and surface tones, with accent selection feedback and separate calculated
and committed values. At 760px and below, stack the columns and reveal selected details
or the started timeline through focus and scrolling. Keep the toolbar, theme control and
index return visible; reference prose is a separate view. Preserve this topic's distinct
form rather than applying NestJS pan/zoom behavior. See
[the React surface contract](docs/surfaces/react-learning.md).

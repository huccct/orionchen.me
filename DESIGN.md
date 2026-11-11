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
long titles remain readable. Each section has distinct artwork in the outer margins: home uses contour lines;
writing uses manuscript rules; works uses geometric orbits; reading uses page arcs;
about uses circular compositions; guestbook uses conversation outlines; topics uses
connected index nodes. Article detail backgrounds are quieter. Chinese and English
share the same section artwork. The central text column stays clear. Background artwork drifts subtly on a 24-second CSS cycle; article and work detail pages stay static.
Respect reduced motion, pause while the page is hidden, and offer a localized pause/play control
in the footer. No pointer tracking or animation library is needed.

## Components

The independent Knowledge Maps tab inherits the site's neutral palette and typography.
Its index uses quiet, fully linked topic rows: a short title, one learning goal, and a theme-aware diagram preview. No dates, article labels, or explanatory footer. NestJS topic detail is an immersive, full-viewport mind-map
workspace: a central topic, bilateral domains, expandable groups, curved colored connectors and clickable
concept leaves. The site header/footer recede while the workspace is mounted; a return
link leads to the learning index. A compact toolbar switches between the map and existing
prediction experiments / understanding checks.

Pan the map by dragging or scrolling; zoom with controls or modifier-wheel; fit the map
or restore actual size; expand/collapse branches. A right inspector contains explanations,
related concepts, optional code and official docs. Preserve zoom when opening it. Closing
returns focus to the last selected node, or the canvas if none exists. Below 640px,
the map starts centered at 65% zoom, offers the
same pan/zoom controls and a theme-aware, grouped concept locator with a bounded scrollable list, with a scrollable overlay inspector.
Keep theme controls and keyboard alternatives. Reference prose belongs in the book-icon
panel, not above the map. No decorative motion or prerequisite reading wall.

Future topics reuse the learning method in [the authoring guide](docs/visual-learning.md),
not necessarily the NestJS tree.

### React learning extension

React inherits the neutral/moss tokens and existing typography, using the same shared
full-viewport map workspace as NestJS: central root, colored domains, groups and
concept leaves, pan/zoom/fit controls and independent domain/group collapse. Keep the right inspector,
focus return and book-icon reference panel consistent across both topics. Below 640px,
retain centered 65% initial zoom, the theme-aware, grouped concept locator and overlay inspector.
The React experiment pairs prediction controls with a four-stage timeline and separate
calculated/committed values; its columns stack at 760px and below. Preserve quiet surface
tones, keyboard controls, theme switching and the index return. See
[the React surface contract](docs/surfaces/react-learning.md).

### Expanded learning curricula

Both topic workspaces use four levels: topic → domain → group → concept. Domains and
groups start collapsed so the opening view communicates scope. Geometry is calculated
from visible content, balanced on both sides of the root; never hard-code a branch count
or fixed leaf coordinates. Search filters the concept locator; choosing a concept opens
its domain and group. Use the inspector's level label and explicit experiment availability
to distinguish conceptual coverage from interactive teaching. Code disclosures appear only
when a useful snippet exists. The source-derived [curriculum outline](docs/learning-curriculum.md)
records current coverage; it is not a promise to cover every API or ecosystem package.

### Matrix homepage (`/`)

The default homepage is the Matrix/Neo room. The former text-first home remains at
`/classic`; `/matrix` redirects to `/`. Other pages retain the text-first design. A procedural Three.js CRT workstation,
warm desk lamp and cool rainy window light textured wood, aged plastic and plaster.
Labelled keys, a handwritten note and a floppy disk give the desk lived-in detail.
Monospace terminal type and phosphor green belong to this homepage experience.

Click the physical screen (or focus the canvas and press Enter) to smoothly move the
camera in front of the monitor. Actual DOM links and scrollable posts are projected
inside its screen; the surrounding CRT remains visible. Internal links open a
same-origin iframe with a green reading theme; next-article navigation stays inside
it, while independent reading opens a new tab. Escape inside the reader returns to
the terminal; Escape there, an outside click or disconnect returns to the desk.
Focus follows entry and exit. Mobile reading brings the camera closer and expands
the text viewport for readability.

Click the lamp or press L to toggle it; the floppy opens Vibe. P, the monitor knobs
and the terminal motion control pause the environment. Reduced motion skips camera
transitions and environmental animation. Hidden tabs suspend animation frames;
screen textures update only when their cursor state changes, and shadow maps remain
static. WebGL failure or context loss offers a text-terminal fallback.

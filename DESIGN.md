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
available for long-form article headings. Content measures roughly 660px on the homepage
and archives; article pages may widen for the table of contents. Paragraphs have spacious
line height, natural inline links, and no containing cards.

## Surfaces and interaction

Lightweight header with signature, visible text navigation, locale and theme controls.
Homepage: name, natural introduction with meaningful links, social links, latest writing.
Writing: year-grouped plain links, quiet dates, existing pagination and topic routes.
Archive headers are text-only. Reading shows book recommendations beside typographic covers.
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
16:9 composition with contain sizing and no hover crop; mobile uses a single column. Top navigation contains Writing, Works, Reading only;
About and Guestbook remain available in the footer, with Guestbook also in the introduction.

Writing archives now show authored summaries, linked topics, dates and the first local
article illustration where available. Year labels remain small; desktop adds a narrow
sidebar with topic counts and existing book recommendations. Mobile stacks content and
sidebar, preserving pagination. Do not fabricate covers for text-only articles.

Reading uses custom typographic book covers (explicitly distinguished from publisher
artwork), visible recommendation notes, and direct book links. Solid cloth-like colors
and a slight hover tilt add tactility. Each section has distinct static artwork in the outer margins: home uses contour lines;
writing uses manuscript rules; works uses geometric orbits; reading uses page arcs;
about uses circular compositions; guestbook uses conversation outlines; topics uses
connected index nodes. Article detail backgrounds are quieter. Chinese and English
share the same section artwork. The central text column stays clear. No background
JavaScript, tracking of the pointer, or continuous animation is needed.

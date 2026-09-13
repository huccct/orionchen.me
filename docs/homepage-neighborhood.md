# Interactive neighborhood homepage

The current user-approved direction is the retro pixel town. See [pixel-town.md](pixel-town.md)
for the reference contract, rendering approach and asset provenance.

`Neighborhood` connects real locale-aware blog, work, and book data to `PixelTown`.
House doors and lower navigation approach an entrance before opening `RoomInterior`.
The interior uses the corresponding illustrated room, horizontal pan, and furniture
hotspots to show content. Only content links navigate away. The postbox opens the
guestbook; the dog selects an existing post. Modified clicks preserve ordinary routes.
`/#writing-room`, `/#works-room`, and `/#reading-room` reopen rooms, including `/en/`.

The exterior background and registered character sprite strips are independent layers.
Characters use the tested timed return-trip helper and pause at route ends. Motion
pauses inside rooms, in hidden tabs, through the pause control, and with reduced motion.
No WebGL or new animation dependency is needed for this surface. Native HTML links,
buttons and dialogs provide keyboard access, focus restoration and Escape behavior.

Room headers share current pixel assets; ordinary archive filters, pagination, article
URLs, tags, reading recommendations and guestbook comments remain available.
The prior Blender scripts, GLB assets and rendered sources are retained as earlier
modeling work; they are not the active homepage or indoor rendering path.

Validation: TypeScript, ESLint, Vitest asset/route checks, Next production build, plus
browser checks for doors, real content, keyboard exit, sprite pause and portrait pan.

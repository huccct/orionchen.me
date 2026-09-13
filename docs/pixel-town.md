# Pixel town

## Reference contract

- Source: `output/pixel-town/approved-reference.png`, the user-approved retro game town concept.
- Borrow: full-viewport composition, mint/terracotta/teal roofs, clustered pixel shading, physical shop signs, literary village with moving people and a dog.
- Omit: generated signatures, placeholder slogans, static people, decorative UI copy.
- Fidelity: closely preserve the exterior composition and color; original SVG signature and real bilingual blog content remain live HTML.
- Constraints: existing routes/content, keyboard navigation, mobile exploration, reduced motion, no deployment.
- Review gate: the user approved the pixel concept before implementation. Compare browser capture with the approved reference.

## Assets and implementation

Built-in image generation produced a clean town plate, three matching interior plates, and a transparent four-frame sprite atlas. Prompts: preserve the approved village but remove people/UI/slogans; generate coordinated writing/studio/reading rooms from inside the doorway; generate four walk frames for a bandana-wearing dog, a reader and a gardener. Source PNGs stay in Codex generated_images; web assets are in `public/images/pixel-town/`.

This is a layered 2D pixel scene, not a freely orbiting 3D model. The background is static artwork; separately registered sprite frames move along fixed paved routes. Doors zoom into matching illustrated interiors. Inside, desks/screens and shelves open real content. Drag/arrow controls pan wide scenes on narrow screens; bottom links offer direct access. Native dialogs trap focus and Escape returns to the town. Animation stops while inside a room, hidden, manually paused, or when reduced motion is requested.

# CLAUDE.md - orionchen.me

## DO NOT

- Add SEO/analytics features beyond what's in
  `docs/superpowers/specs/2026-05-17-personal-studio-design.md`
- Add a newsletter signup, "subscribe" CTA, or email capture
- Add Pro / paid / membership / paywall mechanics
- Install heavy animation libs (framer-motion ok if used minimally; no GSAP, no lottie)
- Touch `/blog/[slug]` URL shape - SEO depends on it
- Add a chatbot widget, "Site Agent", or floating help bubble
- Auto-translate posts; post bodies are hand-written per locale (see `docs/superpowers/specs/2026-06-10-i18n-unfreeze.md`)
- Re-export types or leave dead code "for backwards compat"

## ALWAYS

- One commit per Task in `docs/superpowers/plans/...md`
- Conventional Commits: `feat: ...` / `fix: ...` / `chore: ...` / `docs: ...`
- `pnpm lint && pnpm typecheck && pnpm build` must pass before commit
- For UI changes, eyeball in dev server before commit (no UI snapshot tests)
- Migration script + content schema are TDD; UI is not

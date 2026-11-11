# Orion Chen’s personal website

<!-- impeccable:product-schema 1 -->

## Platform

web

## Purpose

A personal home for code, documentary work, writing, and reading. Visitors can
browse published articles, discover works, read about the author, and leave a message.

## Positioning

Orion Chen’s own writing, code experiments, documentary work, and book recommendations
share one personal site.

## Operating Context

Visitors browse on desktop and mobile through Chinese and English routes. Writing,
Works, and Reading are the primary navigation; About and Guestbook remain available.
The existing implementation uses Next.js App Router, React, and content-collections.

## Capabilities and Constraints

Preserve published content, bilingual routes, locale availability, comments, RSS,
and book recommendations. Keep existing URL shapes and the retired town redirects.

## Brand Commitments

In October 2026 the user retired the pixel town and chose a text-first personal site,
using antfu.me as the aesthetic reference: quiet typography, generous whitespace,
small personal details and polished interactions. Keep the existing handwritten
signature. On November 11, 2026 the user chose the Matrix/Neo computer room as the default
Chinese homepage. Keep the text-first homepage at `/classic` and the existing English
home at `/en`; other content pages retain ordinary website navigation. Visual details live in DESIGN.md.

## Evidence on Hand

- Published articles: `src/content/posts/`.
- Code experiments and documentary entries: `src/content/works/`.
- Bilingual copy and reading recommendations: `src/i18n/dictionaries/`.
- Real book covers and their source records: `public/images/books/`.

## Product Principles

- Keep Writing, Works, and Reading recognizably part of the same site.
- Present the author’s actual content and real cover artwork.
- Preserve access to existing content across languages and screen sizes.

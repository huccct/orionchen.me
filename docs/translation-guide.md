# Post Translation Guide (zh → en)

This guide is shared by all subagents working on the bulk translation
of `src/content/posts/*.mdx` from Chinese to English. It captures the
voice, mechanics, and frontmatter conventions used by the two pilot
posts (`flexbox-layout.en.mdx`, `2024-final.en.mdx`) so the rest of
the corpus stays consistent.

## Output

For each source `<slug>.mdx`, write a sibling file `<slug>.en.mdx`.

- Same directory: `src/content/posts/`
- Same slug field in the frontmatter (do NOT change the slug)
- Add `lang: en` in the frontmatter
- Preserve every non-translated frontmatter field verbatim (date,
  draft, earlyContent, cover) unless the rule below changes it

## Frontmatter rules

| Field | Rule |
|---|---|
| `title` | Translate. Drop bracket-prefix conventions like `[css基础]：` and rewrite as natural English (`CSS Fundamentals: ...`). Use sentence-case or title-case as fits. |
| `date` | Keep verbatim (string, do not reformat). |
| `slug` | Keep verbatim. |
| `summary` | Translate idiomatically. Keep the original tone (poetic stays poetic, practical stays practical). Don't be literal with idioms. |
| `seoTitle` | If present, translate to a natural EN SEO title. If absent, leave absent. |
| `seoDescription` | If present, translate. If absent, leave absent. |
| `seoKeywords` | If present, translate to common EN search terms. Drop any pure-Chinese-language keywords (e.g. drop "前端面试", keep "frontend interview"). If absent, leave absent. |
| `tags` | Keep all tags **except**: drop the literal `chinese` tag (it's a language marker for filtering, meaningless in EN). Don't translate other tags — they're identifiers, e.g. `css`, `frontend`, `life` stay as is. |
| `draft` | Keep verbatim. |
| `earlyContent` | Keep verbatim. |
| `cover` | Keep verbatim (URL/path). |
| `lang` | Set to `en`. |

## Body translation rules

### Hard rules (do NOT break)

1. **Code stays as code.** Inside ` ``` ` fenced blocks and ` ` ` inline
   code, do not translate **anything**. CSS values, JS keywords, file
   paths, command flags — all literal.
2. **URLs stay verbatim.** Image links, code-pen URLs, external links.
3. **Image markdown shape is preserved.** `![alt](url)` stays
   structurally identical; alt text can be translated if it's Chinese
   prose, but tiny labels like 例图 → "example" or just empty alt are
   fine.
4. **MDX/JSX tags are preserved.** If you see `<Foo prop="bar">`, keep
   the tag and props exactly. Translate text content between tags.
5. **Heading levels match the original.** Don't promote `##` to `#` or
   demote `##` to `###`. Heading text gets translated.
6. **Don't add or drop content.** No "translator's notes", no
   summarization, no skipping paragraphs.

### Style rules

- **Punctuation conversion**:
  `，` → `,` &nbsp;|&nbsp; `。` → `.` &nbsp;|&nbsp; `：` → `:` &nbsp;|&nbsp;
  `；` → `;` &nbsp;|&nbsp; `？` → `?` &nbsp;|&nbsp; `！` → `!`
  Curly quotes: `"…"` → `"…"`, `'…'` → `'…'`. Use straight quotes if
  the original mixes them.
- **Chinese section markers**: `一、`, `二、`, `三、` → `1.`, `2.`,
  `3.` (or just title without numbering if context fits).
- **Inline-code-wrapped Chinese terms**: e.g. `flex布局` is a label,
  not a literal value — unwrap and translate to "Flex layout". But
  `flex-start` is a literal CSS value — keep as inline code.
- **Idioms**: translate idiomatically, not literally.
  - `云卷云舒` → "let the future unfold", not "clouds rolling".
  - `桃李年华` → "bloom of youth", not "peach and plum years".
  - `稀碎的英语` → "broken English".
  - `口罩之后` → "post-pandemic" (Chinese-internet euphemism for COVID).
- **Voice**: keep the author's conversational rhythm. The author is
  Orion Chen, an engineer-writer. Markers to preserve:
  - `哈哈` → `haha` (lowercase, no exclamation marks added)
  - `呜呜呜` → `(sob)` or similar parenthetical
  - em-dashes for asides — keep them
  - first-person "I" voice
  - matter-of-fact tone, no LinkedIn-style hype
- **Tutorial vs essay tone**:
  - Tutorial posts (CSS/JS/React/Vue/TS guides): practical, direct,
    "Here's how X works." Keep code-first phrasing. Don't pad.
  - Personal essays (life reflections, opinion pieces): reflective,
    a bit literary, preserve metaphors. The author writes about
    growing up in a small town, work, society — match that register.
  - Translate, don't formalize. If the original says "我也不知道"
    write "I don't know either", not "I am uncertain".
- **Tech terms**: prefer the established English term over a literal
  translation:
  - `响应式设计` → "responsive design"
  - `生命周期` → "lifecycle"
  - `组件通信` → "component communication"
  - `防抖` → "debounce", `节流` → "throttle"
  - `事件冒泡` → "event bubbling"
- **English already in source**: keep verbatim. Don't re-translate
  English words back to English.

### Things to be careful about

- `本科` → "undergrad" (not "Bachelor degree program")
- `导师` (academic) → "advisor" or "mentor" depending on context
- `小镇` → "small town" (not "town")
- `转码` (career-change to coding) → "career-switcher into tech"
- `卷` / `内卷` (effort competition) → "grinding" or contextual rewrite
- `BFC` (block formatting context, Chinese tech blog jargon) → keep
  as `BFC` and explain as block formatting context if needed
- Names of people / places: keep as-is or use established English
  spellings. `图南` → `Tunan` (the author's Chinese name) only if it
  appears in body. `oo` placeholder → keep as `oo`.

## Process per post

1. Read the source `.mdx` with the Read tool.
2. Identify: tutorial or essay? Tone follows from that.
3. Translate frontmatter strings per the table above.
4. Translate body per the rules above.
5. Write `<slug>.en.mdx` with the Write tool. Body content is the
   translated MDX; frontmatter is YAML at the top between `---`.
6. After writing each file, sanity-check:
   - File starts with `---` and frontmatter has `lang: en`.
   - All code fences in the source are present in your output (count
     ` ``` ` if uncertain).
   - All image / external link URLs are unchanged.

## Examples to copy from

- `src/content/posts/flexbox-layout.en.mdx` — tutorial reference
- `src/content/posts/2024-final.en.mdx` — essay reference

Read those first if any rule above is ambiguous.

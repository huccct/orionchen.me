# Muscle function learning

Mode: Read. This local extension of Knowledge Maps inherits the site's neutral/moss tokens, heading typography, theme control and restrained borders. It does not change the global visual system.

The user chose a clear clickable teaching schematic for fitness-coach muscle-function study. The full-viewport workspace has a persistent toolbar with a return to `/learning`, learning-reference toggle and theme control; its main content scrolls independently. The anatomy plate and selected explanation lead directly; there is no introductory hero.

## Layout and access

Above 600px, the layout is figure → explanation in two columns, with a collapsed muscle index below the explanation. At 600px and below, the order is figure → explanation → collapsed index, matching DOM order. The plate is capped at 350px on desktop and 310px on mobile so the complete body is visible without the earlier oversized crop. The plate stays white in both themes to preserve the source illustration. Search and region filtering remain inside the expandable index.

Numbered native button markers and indexed buttons provide parallel routes to each entry. Both expose pressed state; the selected marker has an outline and the selected index row has a checkmark. View controls use an underline and weight as well as color. Controls have visible keyboard focus; index rows and most toolbar/form/quiz controls have 44px minimum height, while markers are smaller (32px, or 24px at 600px and below).

## Selection, search and understanding check

The atlas covers 19 muscle or muscle-group entries: 10 anterior and 9 posterior. It starts with the anterior pectoralis major entry. Switching to the other view selects its first entry and resets the answer; choosing the active view does nothing. Selecting an index entry automatically shows its assigned view. The plate shows all markers for that view, independent of index filters.

Search matches Chinese names, English names and principal-action text, ignoring case and surrounding whitespace. It combines with a region selector (all regions, shoulder/upper arm, scapula/back, trunk, hip/thigh, lower leg). A live result count and an empty-state message describe the filtered index. Filtering does not change the selected muscle or the figure.

Selecting a marker or index entry focuses the explanation. At 900px and below it also scrolls the explanation into view; these widths include an explicit “view function” button below the plate and a “return to body diagram” anchor in the explanation. The view switch itself does not move focus to the explanation.

Each entry includes Chinese and English names, location, principal joint actions, a functional example, a common confusion and one three-choice question behind a native “检验一下理解” disclosure, collapsed by default and reset when changing muscles. A response immediately reports whether it is correct, supplies the correct choice when needed, and repeats the principal actions as explanation. Answers can be changed. Every selection call clears the answer, including reselecting the current muscle or using the “view function” button. Selection, filters, answer and reference visibility are component-local state; they are not persisted or encoded in the URL. There are no accounts, scores, progress records or mastery claims.

## Reference and content boundaries

Each explanation links directly to its relevant OpenStax chapter. The toolbar's learning-reference button reveals the MDX reading section below the attribution, focuses it and scrolls it into view. Its close button hides the section, returns focus to the toolbar trigger and scrolls back to the atlas. Toggling it closed from the toolbar also scrolls back to the atlas. Attribution and original-image links are available inside learning-reference, alongside the supporting principles.

Content teaches generic functional anatomy, distinguishing joint action from exercise names, stabilization from visible movement, and group-level functions from individual-muscle exceptions. Three supporting notes reinforce these distinctions inside learning-reference. No specific 新国职 textbook edition was supplied: this is not an official syllabus, examination plate, question bank or claim of complete exam coverage. It does not provide training prescriptions, nutrition guidance or disease/pain diagnosis, and does not attempt complete origins, insertions or innervation.

The figure uses OpenStax CC BY 4.0 anterior/posterior illustrations obtained through Wikimedia Commons, adapted with AI to clean old leader lines and rearrange the views, with interactive numbered markers added. Preserve attribution, license and source links in learning-reference. This adapted teaching image does not replace an original anatomical atlas: shoulder, gluteal and calf regions include cutaway/deep-tissue views; markers locate regions rather than precise muscle boundaries. Deep iliopsoas and grouped shoulder-cuff structures cannot be completely represented by one surface view. Static imagery does not establish contraction, complete tissue relationships or pain sources.

Acceptance checks: both themes remain readable; no horizontal overflow at 390px; markers and index entries work by keyboard; selected muscle and view remain consistent; filters have useful zero-result feedback; selection clears the answer; reference focus/return works; source attribution and image provenance stay intact. These are checks to run, not a record of completed validation.

# Shell UX

The 2026-10-18 task covers arrival, finding a component, moving within a page,
using page actions and continuing to the next reference. The common shell retains
GenUX’s Flat 2.0 language, palette and Outfit. Component product, previews, native
adapters, tokens and themes are outside this change.

Sidebar groups use native details/summary with a shared name: click toggles the links
inline and opening a group closes the previous one, including without JavaScript in
supporting browsers. The current group starts open and session choices survive navigation.
Search keeps one matching group open; clearing restores the ordinary choice. On a wide layout with a
hover-capable precise pointer, a closed heading also opens its links to the right.
`nav-flyout.ts` owns this temporary native popover, outside scroll clipping; it never
changes the saved disclosure state. Leaving the heading/panel closes it after a short
pointer transit allowance. Escape, outside click, search, scrolling and resize dismiss it.
Touch, narrow layouts and browsers without Popover use the same inline disclosures.
The flyout consumes shell surface/width roles, central symmetric motion and reduced
motion; its real navigation links retain the shared ringless keyboard focus treatment.

The second 2026-10-18 pass keeps component queries in tab-scoped session storage (blocked
storage falls back to ordinary filtering). A nonempty component query temporarily yields
the foundation groups to the matching components; Clear restores the full navigation.
Browser-restored input wins over stored query. The native Drawer returns focus to its
actual invoker rather than always Menu, while desktop placement retains sidebar focus.
`section-navigation.ts` enhances existing native fragment links with `aria-current=location`
and deliberate labelled-target focus with a heading marker; it introduces no router, scrollspy or history store.
Component tabs retain their own hash/panel ownership. Narrow article Page actions is a
native initially closed disclosure; desktop rail actions stay expanded. The footer links
both the project MIT license and third-party notices through the validated repository/ref.

The Claude round of the second pass (2026-10-18) ran the browser layer the Codex round could
not and corrected what it found. The header Search trigger focuses itself before it opens the
Drawer (`shell-controls.ts`): WebKit does not focus a button on pointer click, so the single
Drawer owner would otherwise return focus to Menu instead of Search. Below the contents rail
the "On this page" and "Page actions" disclosures are one group (`layout.css`,
`page-tools.css`): 48px summary rows on the shell emphasis weight with the container-sm
inset, touching, with their open link lists on the same text edge; the Contents summary and
links keep the ≥16px inset inside the details box that the protected spacing spec measures.
Copy as Markdown keeps inline links as `[text](resolved href)` and inline code as
`` `code` `` in headings, paragraphs and list items (`docs-page.ts`); table cells, code
blocks and the existing exclusions are unchanged. Visual/physical-device, independent
aggregate acceptance, CI and live outcomes still require their own actual evidence.

## Ownership

- `src/layouts/DocsLayout.astro` owns the document/header and supplies title and
  Astro route source to the shell. Search and primary routes keep their destinations;
  version/Flat 2.0 metadata lives in the common footer. The filled Getting started
  action is `.header-link` only (not the shared `.docs-action`, which Overview content
  uses and a protected contract spec locates strictly); `shell.css` gives it the
  central hover opacity and the ringless inverted keyboard fill. Below the 875px
  sidebar breakpoint the action is not rendered: the Drawer's Start group owns the
  same route, so the sticky header is two rows at 320px and one row in phone
  landscape, clear of the viewport-fixed Tweaker tab.
- `src/components/shell/DocsShell.astro` retains the single moved sidebar and native
  Drawer, and composes guide article, Contents and footer. Component pages keep
  their article and existing catalog order.
- `shell-tokens.css` defines only `--shell-ui-*` presentation roles. They consume
  existing palette/type/spacing roles and never redefine a product role. `shell.css`,
  `layout.css` and `nav.css` own their existing regions; `contents.css` and
  `page-tools.css` own the shared rail/actions.
- `ContentsRail.astro` renders component links directly. `contents.ts` projects
  guide links from existing section navigation only when their targets exist.
  It reuses labels/i18n, with no scrollspy, history or state store. Existing guide
  inner rails yield to the shared rail. Without JavaScript, native guide Contents
  remains available. The right rail shares the article surface. Its "Contents" and
  "Page actions" titles use the shell emphasis weight (600) above 400-weight links;
  `layout.css` no longer forces the documentation label weight on rail paragraphs.
- Landmarks: the sidebar `aside` is named by its visible "Component library" title
  (`aria-labelledby`), the rail `aside` is "On this page" (translated), the inner
  navigations stay "Documentation" and "Contents", and the Drawer keeps
  "Documentation" because a protected browser spec queries that name. Repeated
  landmark roles therefore carry unique labels (APG landmark regions).
- `DocsPageTools.astro` receives the actual page source from Astro’s matched route;
  component references link to their common `[slug].astro` template. Published text
  copies still require `published-sources.ts`; other sources link to repository blob.
  Edit and contextual issue links use the existing validated repository/ref. Links
  do not submit issues or send content.
- `docs-page.ts` enhances article Markdown even without tabs; component tabs,
  hashes and install manager keep the existing behavior. Static article text is
  copied, excluding live demos, islands and shell controls. Live status reports
  the resolved or rejected clipboard promise in the current locale. Without the
  Clipboard API, the action stays hidden.
- `PageNavigation.astro` consumes the catalog neighbour model; missing boundaries are
  omitted. `src/data/component-navigation.ts` is the single owner of the visible catalog
  order (categories in first-appearance order, catalog array order inside a category):
  `DocsNav.astro`, the catalog page and `catalogNeighbors` in `src/data/component-page.ts`
  all read it, so previous/next continue exactly the sidebar and catalog sequence
  (Button → FAB → Input …) with the same canonical `/components/<slug>/` hrefs; the
  catalog dataset itself is unchanged. `ShellFooter.astro` reads the package version and
  retains home/license destinations and adds the validated repository link, so GitHub
  stays reachable below the 1280px header links. Phone destinations stack; larger layouts
  use two columns.
- Fixed Tweaker clearance: `layout.css` defines one `--shell-tweaker-clearance` role
  (trigger size plus the right safe area) below the 80rem contents rail, where the article
  meets the viewport edge. On component pages every reading box, link and control of the
  article (breadcrumb, title, lead, meta, Contents disclosure, tab row, sections, page
  tools, neighbours, footer) keeps that clearance, while `.live-preview` keeps the full
  main column (288px at 320px) with its protected device geometry, screens and controls;
  API tables and code keep scrolling inside the padded sections. Guide main columns and
  the article page tools consume the same role. The tab stays viewport-fixed and
  vertically centred (human decision 2026-10-17); nothing hides it.
- Component search Escape: a non-empty `type=search` field consumes the first Escape
  as a native clear in Chromium and Firefox, so the Drawer closes on the second;
  WebKit closes on the first and keeps the value. The shell does not override this.
- Component search retains one canonical native input, shortcut, Drawer and scroll
  memory. A short translated placeholder fits the rail; an explicit nearby Clear
  search action restores rows and returns focus to the same input. Below a 640px
  viewport height (phone landscape, small windows) the bounded inner list and the
  sticky sidebar height are released in `layout.css`, so the whole Drawer or the page
  scrolls instead of the note overlapping the Clear action over a collapsed list;
  `nav-state.ts` then skips saving because the list is not a scroller.
- The existing locale subscription also updates the small shell dictionary in
  `src/locales/tr/shell-ux.json`; no second preference or storage mechanism exists.

## Focus, motion and protected boundaries

Normal focus is ringless and gated by the central Tab-only mode. Documentation
navigation’s local underline now uses that gate. Forced colors retain the exact
keyboard-only `2px solid CanvasText` exception from the existing shared focus layer.
New paint states use the existing bidirectional symmetric Cubic transition layer;
focus, status, input and ARIA updates remain immediate. Reduced motion still belongs
to the central layer. The 200px rail role, preview surfaces and hardware geometry
remain unchanged. No iframe, Inspector, featured library or alternate Tweaker was added.

## Verification and limits

From the repository root:

```sh
node --test docs/tests/shell-ux.test.mjs
node --test docs/tests/document-controllers.test.mjs docs/tests/documentation-architecture.test.mjs
npm run docs:format
npm run docs:lint
npm run docs:check
npm run docs:test
npm run docs:build
npm run docs:test:site
npm run docs:browser:check
GENUX_DOCS_PAGES=1 npm run docs:build
```

The isolated shell browser configuration avoids unrelated FAB discovery:

```sh
node node_modules/@playwright/test/cli.js test --config docs/browser/shell-ux.config.ts
```

For the second pass's changed journeys only, append `shell-journeys.spec.ts`. The shell
configuration now serves the already built `docs/dist` using Python's installed static
HTTP server, avoiding Astro preview's nested cache side effects. Screenshots and computed
type/layout records are attached when execution is available; none is inferred from unit tests.
Three of its steps are engine-neutral on purpose: it waits for `[data-docs-shell-ready]` after a
search-result navigation before using the Search trigger (Firefox otherwise clicks before the
script attaches), it turns the keyboard modality on with a Tab keydown and then focuses the
Contents link directly (WebKit keeps links out of its Tab sequence), and the ringless target
asserts `outline-style: none` (CSS UI 4 computes a width even then). The Claude round ran
`shell-ux.spec.ts` + `shell-journeys.spec.ts` on the rebuilt candidate in Chromium 156,
Firefox 157 and WebKit 27.2; the exact result is in that round's artifacts, not here.

It uses existing installed engines and a candidate production preview on localhost
4335, never personal Chrome. Chromium takes bounded phone/landscape/tablet/desktop
samples; Firefox/WebKit take representative narrow/desktop samples. This is local
engine automation, not physical device or real Safari certification. It checks search
recovery, guide/catalog Contents/actions, clipboard rejection, component continuation,
text size/font, page overflow and inline preview boundary, and saves screenshots and
computed-style/request records when execution is available.

Round 1’s activity sandbox rejected localhost binding and isolated Chromium launch, so
its browser layer was `not_run`. Round 2 ran the isolated shell suite on the rebuilt
candidate: 9/9 in Chromium 156, Firefox 157 and WebKit 27.2 (local engine automation on
macOS, not physical devices, real Safari, CI or the live site), after a genuine Chromium
RED on the header action, rail title weight and footer repository assertions, plus one
real failure at 568×320 where the sidebar note overlapped Clear search over a collapsed
list, corrected in `layout.css`. Measured at 320/360/375/390/568×320/820/1280/1920 in
light and dark: no page-wide horizontal overflow, all shell text ≥ 14 px Outfit, lowest
normal-text contrast 4.93:1, anchored headings below the sticky header, preview screens
untouched. Existing full docs source (87 failures), site (20 failures) and FAB browser
discovery failures are unchanged release blockers, recorded rather than repaired; exact
command results are in the private task artifacts. Root owns independent QA, CI, live
verification and publication. No visual baseline was updated.

The 2026-10-18 continuation of Round 2 resolved the two independent MAJOR findings only.
The Tweaker tab no longer meets component article prose, links or controls below the
contents rail (measured 0 painted intersections at 320/360/568×320/820/1024 in Chromium on
Button, FAB and Data table, with the live preview still 16/288 at 320px), and previous/next
follow the visible grouped order on all 41 built pages (0 mismatches; sidebar and catalog
markup byte-identical before and after). One added `shell-ux.test.mjs` scenario carries the
neighbour contract; the existing component browser scenario carries the clearance and the
sidebar-successor assertions and passes in Chromium, Firefox and WebKit. Whole suites were
not rerun; the known blockers above are unchanged.

# Documentation application architecture

The Astro 7 documentation application in `docs/` is a modular monolith: one build,
one deployable static site, with modules separated by ownership and explicit imports.
It uses the installed React 19 and TypeScript toolchain without additional frameworks,
containers or layers. The published component product (React adapters, demos, styles,
tokens, themes and existing tests) remains outside application infrastructure refactoring.

## Modules and ownership

| Module                    | Files                                                                                        | Owns                                                                                                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document view             | `src/layouts/DocsLayout.astro`                                                               | HTML document, head/SEO, first-paint bootstrap, page header and the document controller entrypoint                                                                               |
| Document controller       | `src/layouts/docs-controller.ts`                                                             | Theme/language controls and subscriptions, locale restoration, composition of existing feedback, Theme Builder, overlay and modality owners, and their existing page lifecycle   |
| Navigation filter         | `src/components/shell/component-filter.ts`                                                   | Component/group visibility and empty-result status from the canonical search value and translated labels; returns a refresh function used on input and locale changes            |
| Code copy                 | `src/components/code-copy.ts`                                                                | Per-block clipboard action and localized live status, installed once for the document lifetime                                                                                   |
| Shell frame               | `src/components/shell/DocsShell.astro`, `docs-shell.ts`, `shell-controls.ts`, `nav-state.ts` | Header slot position, native menu Drawer and single sidebar placement; search shortcut, measured header height and navigation scroll memory remain separate cohesive controllers |
| Repository metadata       | `src/data/repository.ts`                                                                     | Shared public repository/ref validation and defaults, consumed directly by server-rendered views                                                                                 |
| Published sources         | `src/published-sources.ts`                                                                   | Build-time allowlist of the source files published as text copies, their docs-relative paths and `sourceHref` links; a shared module, not a route                                |
| Source copy route         | `src/pages/source/[...path].txt.ts`                                                          | Static paths and text responses over the published set, with the Pages machine-prefix redaction and credential fail-closed guard                                                 |
| Component page controller | `src/components/docs-page.ts`                                                                | Tabs, section links/history, article Markdown copying and package-manager choice                                                                                                 |
| Component route contract  | `src/data/component-routes.ts`                                                               | Per catalog slug: React island module/export and component stylesheets in cascade order; pure data safe for client bundles                                                       |
| Component page model      | `src/data/component-page.ts`                                                                 | Published source/test resources, generated Astro example, tab groups, section items and catalog neighbours over the visible order                                                                       |
| Catalog navigation order  | `src/data/component-navigation.ts`                                                           | Visible catalog order shared by the sidebar, the catalog page and previous/next: category groups in first-appearance order with their section ids; pure data over the catalog     |
| Component route view      | `src/pages/components/[slug].astro`                                                          | Literal demo and `?url` stylesheet imports, stylesheet name/URL binding and page markup                                                                                          |
| Preview registry          | `src/preview/registry.ts`                                                                    | Literal dynamic demo loaders; source, export and stylesheets derive from the route contract                                                                                      |
| Preview document          | `src/pages/preview/[id]/[profile].astro`                                                     | Standalone build-time preview document for one example/profile (protected)                                                                                                       |
| URL, SEO and discovery    | `src/data/url-policy.ts`, `seo.ts`, `url-discovery.ts`                                       | Canonical paths, metadata, structured data and shared discovery entries for sitemap, manifest and text index                                                                     |

## Dependency direction

```text
layouts/DocsLayout.astro -> layouts/docs-controller
layouts/docs-controller -> shell/component-filter, components/code-copy
layouts/docs-controller -> existing theme, i18n, feedback and document-wide owners
layouts/DocsLayout.astro -> shell/DocsShell.astro
shell/DocsShell.astro    -> shell/docs-shell, shell/shell-controls
shell/DocsNav.astro      -> shell/nav-state
DocsLayout, DocsInstall, DocsPageTools -> data/repository
DocsPageTools, pages/components/[slug], pages/preview-code/[id].json, pages/source/[...path].txt
                              -> published-sources
pages/components/[slug].astro -> data/component-page -> data/component-routes
data/component-page, shell/DocsNav.astro, pages/components/index.astro
                              -> data/component-navigation -> data/catalog
preview/registry              -> data/component-routes
```

The controllers use the existing theme/i18n singletons; splitting files does not create
another store, input-modality writer, persistence key or initialization system. Repository
metadata does not depend on the component-page browser controller. New controller modules
never import an Astro view or route. No module outside `src/pages` imports a route module;
`docs/tests/documentation-architecture.test.mjs` scans the application sources for that rule.

`data/component-routes.ts` imports nothing. The component route and preview registry share
one table. Astro requires statically imported component tags for `client:*` islands, so the
route retains its literal island lines. The registry retains literal `import()` loaders for
the bundler. Server-only page metadata does not enter those client delivery modules.

`published-sources.ts` holds the raw `import.meta.glob` allowlist relative to `src/`; the
published set is the same as before the extraction, and the source route only serves it.
Controllers under `src/layouts`, `src/components` and `src/components/shell` are not in the
allowlist, as before; only `.astro` views in those directories and `src/data` modules are
published.

## DOM and lifecycle contracts

`DocsShell` renders `<slot name="header" />` as the first child of `[data-docs-shell]`.
`DocsLayout` supplies the unchanged header. Shell controllers find the same header controls
inside that root. Moving controller code must not change rendered markup, inline first-paint
scripts, CSS ownership, header measurements, sidebar placement or focus behavior.

Each Astro entrypoint installs its controllers once per document. The document controller
keeps the existing ordering of preference initialization, locale restoration and subscriptions.
Its `pagehide` releases feedback, Theme Builder and subscriptions; `pageshow` restores them.
The search input binding and per-block copy/status nodes stay installed across bfcache.
The shell controls release search listeners and header measurement on `pagehide`, reinstalling
only on persisted `pageshow`. The native Drawer and navigation scroll controller keep their
own existing lifecycles. These different lifetimes do not require a generic lifecycle layer.

Grid, Tweaker, Alone, centered preview controls, visible-disabled Actual size, direct component
rendering and locked preview surfaces remain protected product contracts. The approved
Overview featured-section and component Inspector removals must be preserved.

## Verification

From the repository root, the unchanged `npm run docs:verify` stages are the mandatory
documentation gate. Stages may be executed individually to retain results after an existing
failure; a successful build is not a passing overall gate. Existing controller tests bundle
the first layout script with its transitive imports, sharing the real i18n singleton.

`node --test docs/tests/document-controllers.test.mjs` adds one preservation scenario using
the real shell entrypoint and shell/header/search markup from the Astro templates. It checks
search keyboard ownership, focus, header measurement and bfcache restoration without a prior
build, so the existing `docs:verify` ordering still works in a clean checkout. JSDOM's
simulated dialog and ResizeObserver APIs do not establish real-browser geometry or visuals.

`node --test docs/tests/documentation-architecture.test.mjs` adds one dependency-direction
scenario: every `.astro`, `.ts`, `.tsx` and `.mjs` module under `docs/src` outside `pages`
must not import a module from `docs/src/pages`. Both files run inside `docs:test`.

Architecture rounds compare a fresh build before and after the refactor: rendered HTML after
hashed asset URL normalization, exact CSS contents, discovery output and JavaScript size
changes. Source-text endpoints may reflect changed owned source files. No visual baselines
are updated. Local source/DOM/build checks, browser execution, remote CI, live publication
and physical-device acceptance are distinct evidence layers.

## Open items

- `docs/tests/accessibility-shell.test.mjs` expects sidebar search markup in the layout and
  older placeholder colour rules; the canonical search now uses the protected
  `genux-input-frame` styling. Its existing failure is outside this refactor.
- The component page's "Astro route and layout" resource list does not name the extracted
  data/controller modules. Adding visible resource content is a separate decision; the
  published-source allowlist also does not publish the controller locations.
- `docs-controller`, `shell-controls`, `nav-state` and `overlay-backdrop` each own their
  own `pagehide`/`pageshow` lifetime. No defect has been reproduced; a shared helper is not
  justified without one.
- The three architecture rounds recorded their plans, command logs, build comparisons and
  the guarded promotion receipts outside this repository. This document does not authorize a
  commit, deployment or repair of unrelated failing gates.

## Shell UX composition — 2026-10-18 candidate

The newer human shell task permits scoped visual and journey changes after the
infrastructure-only rounds. `SHELL-UX.md` records those owners and checks. The document
still supplies the header slot, and the single sidebar/Drawer and measured header keep
their existing controllers. The shell composes guide Contents/page tools/footer; the
component route supplies existing section and neighbour data to shared shell views; the
neighbour data follows the visible catalog order in `data/component-navigation.ts`, which
the sidebar and the catalog page also render.
`contents.ts` projects guide links from existing section navigation without another
scroll/history store. `docs-page.ts` now enhances ordinary articles as well as tabbed
component articles. `foundation-navigation.ts` maps the matched Astro file route for
page-aware tools; protected repository and published-source modules stay unchanged.
The shell dictionary is consumed through the existing locale subscription.

Only `--shell-ui-*` presentation roles are new. Published product roles, source allowlist,
preview geometry/surfaces and URL/SEO contracts are unchanged. Older statements of exact
markup/CSS identity apply to the architecture rounds, not this later authorized shell
presentation task. The second (Claude) round kept module ownership as listed above: the
header action lost the shared `.docs-action` class and is hidden below the sidebar
breakpoint, rail titles take the shell emphasis weight, the sidebar and rail asides are
named, and the shared footer links the validated repository. `SHELL-UX.md` records the
browser evidence; CI and live acceptance remain root's receipts.

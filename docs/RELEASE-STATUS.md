# Release status

Technical release contents and verification scope. Publication is confirmed by the [Pages workflow](https://github.com/atonota/genux/actions/workflows/pages.yml), rather than this source document.

## Changes

- Source naming renamed to GenUX.
- Previews: native vertical scrolling restored.
- Grid: each preview toolbar uses the real controlled Switch component to show or hide its grid.
- Preview controls: Actual size stays visible and is disabled when unavailable; Alone opens the existing fullscreen dialog; the page Tweaker remains at the right edge.
- Removed the component Inspector and the overview's featured component section, including their unused controllers and styles.
- Documentation shell: shared header, navigation, Contents, page tools, previous/next and footer; recoverable search, route-specific source links and truthful Markdown-copy feedback.
- Previous/next follows the same category-grouped order as the sidebar and component catalog. Narrow shell article text clears the Tweaker without reducing the live-preview width.
- Documentation architecture separates route rendering, page models, shell controllers and the published-source allowlist; see [ARCHITECTURE.md](ARCHITECTURE.md) and [SHELL-UX.md](SHELL-UX.md).
- Release preparation for the requested public repository and the GitHub Pages migration to `/genux`.
- The canonical checkout is `/Users/w6x/Developer/genux`. Localhost serves this checkout on port 4324. Compatibility cleanup and runtime migration have their own evidence; this line does not certify their completion.

## Mandatory CI gates (`.github/workflows/adaptive-ui.yml`)

- `npm ci`, decision admission tests and adaptive contract tests (`npm run docs:adaptive:test`).
- Focused FAB gates: `docs/tests/fab.test.mjs`, `component-motion.test.mjs`, `interaction-stability.test.mjs`.
- Docs format, lint and check (`npm run docs:format`, `docs:lint`, `docs:check`).
- Browser config type check (`docs/tsconfig.browser.json`) and production docs build (`npm run docs:build`).
- Adaptive browser tests on Chromium, Firefox and WebKit (`npm run docs:adaptive:browser`).
- FAB browser tests (`docs/browser/fab.config.ts`).

Pages calls this workflow through `workflow_call`, so a deploy requires these gates on its own revision.

## Broad legacy suite

- `npm run docs:test` remains available and unchanged; it is not a gate for this release.
- The shell-round snapshot recorded 527 passes and 87 failures in the broad documentation suite, and 26 passes and 20 failures in the generated-site suite. These suites remain red; scoped shell acceptance does not establish whole-suite success.
- A newly added, unpublished `Docs tests` workflow step was removed only because it fell outside the frozen user-approved coverage. This is not a claim that the suite passes.
- The CI governance assertion in `docs/tests/fab.test.mjs` follows the focused gates (decision admission, adaptive contract and the single FAB, motion and interaction `node --test` step) instead of requiring `docs:test`. The legacy suite stays available and is known red; this is not an approval.

## Verification status

- No CI run, live commit or Pages deployment is claimed until an actual receipt exists.
- The completed shell rounds passed nine planned browser cases across Chromium, Firefox and WebKit. The final two corrections passed six unit scenarios and the changed journey on those three engines, with independent source/visual review and a guarded source promotion. These are bounded local results, not a release receipt.
- Native Claude reached its session quota before writing its final completion receipt. Its Temporal continuation remains blocked; independently accepted source was integrated separately. Source acceptance is distinct from orchestration completion.
- Local Chromium results are not evidence for physical devices, macOS Safari or Firefox. The three-engine CI job provides bounded emulation only; real-device checks are not run.

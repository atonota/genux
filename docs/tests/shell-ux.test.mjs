import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';

async function load(path) {
  const compiled = await build({
    entryPoints: [path],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    target: 'node24',
  });
  return import(
    'data:text/javascript;base64,' + Buffer.from(compiled.outputFiles[0].text).toString('base64')
  );
}
function page(t, body) {
  const dom = new JSDOM(body, { url: 'https://genux.test/getting-started/' });
  const saved = new Map();
  for (const [name, value] of Object.entries({
    window: dom.window,
    document: dom.window.document,
    AbortController: dom.window.AbortController,
  })) {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, value });
  }
  t.after(() => {
    dom.window.close();
    for (const [name, value] of saved) {
      if (value) Object.defineProperty(globalThis, name, value);
      else delete globalThis[name];
    }
  });
  return dom.window;
}

test('component search exposes nearby empty recovery and clearing restores the same input and rows', async t => {
  const view = page(
    t,
    `<input id="component-search"><button data-docs-search-clear hidden>Clear search</button>
    <p id="search-status" role="status" hidden>No results found.</p>
    <section class="nav-group"><li data-component-link="Button button"><a>Button</a></li></section>`,
  );
  const { createComponentFilter } = await load('docs/src/components/shell/component-filter.ts');
  const refresh = createComponentFilter(view.document);
  const input = view.document.querySelector('input');
  const clear = view.document.querySelector('button');
  input.value = 'no-such-component';
  refresh();
  assert.equal(view.document.querySelector('[role=status]').hidden, false);
  assert.equal(clear.hidden, false, 'the empty state exposes an explicit recovery action');
  clear.click();
  assert.equal(input.value, '');
  assert.equal(view.document.activeElement, input);
  assert.equal(view.document.querySelector('[data-component-link]').hidden, false);
  assert.equal(view.document.querySelector('[role=status]').hidden, true);
  assert.equal(clear.hidden, true);
});

test('guide Markdown includes static content and reports resolved and rejected clipboard outcomes', async t => {
  const view = page(
    t,
    `<article data-doc-article><h1>Getting started</h1><p class="lead">Set up once.</p>
    <section id="setup"><h2>Local development</h2><p>Install the pinned dependencies.</p><ul><li>Use Node 24.</li></ul>
    <pre><code>npm ci</code></pre><div data-doc-demo><h2>Private demo</h2><p>Private draft</p></div></section>
    <div data-doc-tools="article"><button data-doc-copy-markdown hidden>Copy as Markdown</button><p data-doc-copy-status role="status"></p></div></article>`,
  );
  let copied = '';
  let reject = false;
  Object.defineProperty(view.navigator, 'clipboard', {
    value: {
      writeText: async value => {
        if (reject) throw new Error('denied');
        copied = value;
      },
    },
  });
  const { installDocsPage } = await load('docs/src/components/docs-page.ts');
  const dispose = installDocsPage(view.document);
  t.after(dispose);
  const button = view.document.querySelector('button');
  assert.equal(button.hidden, false, 'guides have no tablist but still offer Markdown');
  button.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.match(copied, /## Local development/);
  assert.match(copied, /Install the pinned dependencies\./);
  assert.match(copied, /- Use Node 24\./);
  assert.match(copied, /```\nnpm ci\n```/);
  assert.doesNotMatch(copied, /Private|Copy as Markdown/);
  assert.equal(view.document.querySelector('[role=status]').textContent, 'Markdown copied.');
  reject = true;
  button.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(view.document.querySelector('[role=status]').textContent, 'Copy failed.');
  assert.equal(view.document.activeElement, view.document.body, 'copy status does not steal focus');
});

test('previous and next continue the category-grouped order of the sidebar and catalog page', async () => {
  const [{ catalogNeighbors }, { components }] = await Promise.all([
    load('docs/src/data/component-page.ts'),
    load('docs/src/data/catalog.ts'),
  ]);
  // The sidebar and the catalog page list categories in first-appearance order and keep the
  // array order inside each category; the continuation must follow that visible order, not
  // the raw array (which once made Button continue to Input instead of FAB).
  const visible = [...new Set(components.map(item => item.category))].flatMap(category =>
    components.filter(item => item.category === category).map(item => item.slug),
  );
  assert.equal(visible.length, components.length);
  assert.equal(catalogNeighbors('button').next?.slug, 'fab');
  const defects = [];
  for (const [index, slug] of visible.entries()) {
    const { previous, next } = catalogNeighbors(slug);
    const expected = { previous: visible[index - 1], next: visible[index + 1] };
    if (previous?.slug !== expected.previous || next?.slug !== expected.next)
      defects.push({ slug, previous: previous?.slug, next: next?.slug, expected });
  }
  assert.deepEqual(defects, []);
  assert.equal(catalogNeighbors(visible[0]).previous, undefined, 'the first has no previous');
  assert.equal(catalogNeighbors(visible.at(-1)).next, undefined, 'the last has no next');
});

test('guide Contents projects only existing section targets and preserves canonical labels', async t => {
  const view = page(
    t,
    `<div data-docs-guide-grid><article data-doc-article><details data-doc-contents><summary>On this page</summary>
    <nav data-doc-nav="sections"><a href="#setup"><span data-i18n="Local development">Local development</span></a><a href="#missing">Missing</a></nav></details>
    <section id="setup"><h2>Local development</h2></section></article>
    <aside><nav data-shell-contents-nav hidden><div data-shell-contents-list></div></nav></aside></div>`,
  );
  const { installGuideContents } = await load('docs/src/components/shell/contents.ts');
  installGuideContents(view.document);
  const links = view.document.querySelectorAll('[data-shell-contents-list] a');
  assert.equal(links.length, 1);
  assert.equal(links[0].hash, '#setup');
  assert.equal(links[0].querySelector('span').dataset.i18n, 'Local development');
  assert.equal(view.document.querySelector('[data-shell-contents-nav]').hidden, false);
  assert.ok(
    view.document.querySelector('[data-docs-guide-grid]').hasAttribute('data-shell-contents-ready'),
  );
});

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
    <pre><code>npm ci</code></pre><div data-doc-demo><h2>Private demo</h2><p>Private draft</p></div>
    <p>Sources: <a href="/tokens/">Design <em>tokens</em></a> and <code>npm run docs:dev</code>.</p></section>
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
  // Inline destinations and code spans survive the copy; nothing in the tools row does.
  assert.match(
    copied,
    /Sources: \[Design tokens\]\(https:\/\/genux\.test\/tokens\/\) and `npm run docs:dev`\./,
  );
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

test('component query survives navigation, prioritizes matches and clears session memory with storage fallback', async t => {
  const view = page(
    t,
    `<input id="component-search"><button data-docs-search-clear hidden>Clear</button>
    <p id="search-status" hidden>No results</p>
    <section class="nav-group"><a href="/">Overview</a></section>
    <section class="nav-group"><li data-component-link="Button button"><a>Button</a></li></section>
    <section class="nav-group"><li data-component-link="Input input"><a>Input</a></li></section>`,
  );
  const { createComponentFilter } = await load('docs/src/components/shell/component-filter.ts');
  const refresh = createComponentFilter(view.document);
  const input = view.document.querySelector('input');
  const foundation = view.document.querySelector('.nav-group');
  input.value = 'Button';
  refresh();
  assert.equal(foundation.hidden, true, 'component matches should follow the field directly');
  // A newly loaded document starts with an empty field, but shares this tab's session storage.
  input.value = '';
  const restored = createComponentFilter(view.document);
  restored();
  assert.equal(input.value, 'Button', 'normal navigation retains the component query');
  assert.equal(view.document.querySelector('[data-component-link="Input input"]').hidden, true);
  view.document.querySelector('button').click();
  input.value = '';
  createComponentFilter(view.document)();
  assert.equal(input.value, '');
  assert.equal(foundation.hidden, false);
  assert.equal(view.document.activeElement, input);
  // Browser-restored input wins over remembered query, and blocked storage cannot break filtering.
  input.value = 'Input';
  createComponentFilter(view.document)();
  assert.equal(input.value, 'Input');
  Object.defineProperty(view, 'sessionStorage', {
    get() {
      throw new Error('blocked');
    },
  });
  input.value = 'Button';
  createComponentFilter(view.document)();
  assert.equal(view.document.querySelector('[data-component-link="Button button"]').hidden, false);
});

test('Drawer returns focus to its actual invoker and avoids a hidden toggle after desktop transition', async t => {
  const view = page(
    t,
    `<div data-docs-shell><header><button data-docs-menu-toggle aria-controls="drawer">Menu</button>
    <button data-docs-search>Search</button></header><aside class="sidebar"><input></aside></div>
    <dialog id="drawer"><button data-docs-menu-close>Close</button><div data-docs-drawer-body></div></dialog>`,
  );
  const saved = new Map();
  for (const name of ['HTMLElement', 'HTMLDialogElement']) {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, value: view[name] });
  }
  t.after(() => {
    for (const [name, value] of saved) {
      if (value) Object.defineProperty(globalThis, name, value);
      else delete globalThis[name];
    }
  });
  const media = new view.EventTarget();
  media.matches = false;
  view.matchMedia = () => media;
  const drawer = view.document.querySelector('dialog');
  drawer.showModal = () => {
    drawer.open = true;
  };
  drawer.close = () => {
    drawer.open = false;
    drawer.dispatchEvent(new view.Event('close'));
  };
  const { installDocsShell } = await load('docs/src/components/shell/docs-shell.ts');
  const dispose = installDocsShell(view.document);
  t.after(dispose);
  const menu = view.document.querySelector('[data-docs-menu-toggle]');
  const search = view.document.querySelector('[data-docs-search]');
  search.focus();
  menu.click();
  drawer.close();
  assert.equal(view.document.activeElement, search, 'header Search is the invoker');
  menu.focus();
  menu.click();
  view.document.querySelector('[data-docs-menu-close]').click();
  assert.equal(view.document.activeElement, menu);
  search.focus();
  menu.click();
  const input = view.document.querySelector('input');
  input.focus();
  media.matches = true;
  media.dispatchEvent(new view.Event('change'));
  assert.equal(drawer.open, false);
  assert.equal(
    view.document.activeElement,
    input,
    'focused sidebar control survives desktop placement',
  );
});

test('Contents marks actual fragment locations and deliberate navigation continues at the labelled target', async t => {
  const view = page(
    t,
    `<article><details data-doc-contents open><summary>Contents</summary>
    <nav data-doc-nav="sections"><a href="#setup">Setup</a><a href="#missing">Missing</a></nav></details>
    <section id="setup"><h2>Local development</h2><a href="/components/">Continue</a></section>
    <section id="usage"><h2>Usage</h2></section></article>
    <aside data-doc-nav="toc"><a href="#setup">Setup</a><a href="#usage">Usage</a></aside>`,
  );
  const foreign = new JSDOM();
  t.after(() => foreign.window.close());
  Object.defineProperty(globalThis, 'AbortController', {
    configurable: true,
    value: foreign.window.AbortController,
  });
  const { installSectionNavigation } = await load(
    'docs/src/components/shell/section-navigation.ts',
  );
  const dispose = installSectionNavigation(view.document);
  t.after(dispose);
  const link = view.document.querySelector('a');
  link.focus();
  link.click();
  assert.equal(view.document.activeElement, view.document.querySelector('#setup'));
  assert.equal(
    view.document.querySelector('details').open,
    false,
    'the reached content leaves the disclosure behind',
  );
  view.history.replaceState(null, '', '#setup');
  view.dispatchEvent(new view.HashChangeEvent('hashchange'));
  assert.equal(view.document.querySelectorAll('[aria-current="location"]').length, 2);
  view.history.replaceState(null, '', '#usage');
  view.dispatchEvent(new view.PopStateEvent('popstate'));
  assert.equal(
    view.document.querySelector('aside a[href="#usage"]').getAttribute('aria-current'),
    'location',
  );
  assert.equal(view.document.querySelector('a[href="#setup"]').hasAttribute('aria-current'), false);
  assert.equal(
    view.document.activeElement,
    view.document.querySelector('#setup'),
    'history does not steal focus',
  );
  view.history.replaceState(null, '', '#missing');
  view.dispatchEvent(new view.HashChangeEvent('hashchange'));
  assert.equal(view.document.querySelectorAll('[aria-current="location"]').length, 0);
  dispose();
  assert.equal(view.document.querySelector('#setup').hasAttribute('tabindex'), false);
});

test('component tab selection clears Contents location after its owner clears the URL fragment', async t => {
  const view = page(
    t,
    `<article data-component-detail><div data-doc-tabs>
    <button id="tab-examples" data-doc-tab="examples">Examples</button>
    <button id="tab-api" data-doc-tab="api">API</button></div>
    <section id="examples" data-doc-panel="examples"><h2>Examples</h2></section>
    <section id="api" data-doc-panel="api"><h2>API</h2></section></article>
    <nav data-doc-nav="toc"><a href="#examples">Examples</a><a href="#api">API</a></nav>`,
  );
  // JSDOM has no layout/scroll implementation; real fragment offset is a browser check.
  view.HTMLElement.prototype.scrollIntoView = () => {};
  const { installDocsPage } = await load('docs/src/components/docs-page.ts');
  const { installSectionNavigation } = await load(
    'docs/src/components/shell/section-navigation.ts',
  );
  const disposePage = installDocsPage(view.document);
  const disposeSections = installSectionNavigation(view.document);
  t.after(disposeSections);
  t.after(disposePage);
  view.history.replaceState(null, '', '#api');
  view.dispatchEvent(new view.HashChangeEvent('hashchange'));
  assert.equal(
    view.document.querySelector('a[href="#api"]').getAttribute('aria-current'),
    'location',
  );
  view.document.querySelector('[data-doc-tab=examples]').click();
  assert.equal(view.location.hash, '');
  assert.equal(view.document.querySelectorAll('[aria-current="location"]').length, 0);
  view.document
    .querySelector('[data-doc-tab=api]')
    .dispatchEvent(new view.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  assert.equal(view.document.querySelectorAll('[aria-current="location"]').length, 0);
});

test('header Search returns focus to itself after the Drawer closes even where a pointer click does not focus the button', async t => {
  // JSDOM, like WebKit, leaves document.activeElement on body after button.click(); the
  // Drawer owner alone would then return focus to Menu instead of the actual invoker.
  const view = page(
    t,
    `<div data-docs-shell><header><button data-docs-menu-toggle aria-controls="drawer">Menu</button>
    <button data-docs-search>Search</button></header><aside class="sidebar"><input id="component-search"></aside></div>
    <dialog id="drawer"><button data-docs-menu-close>Close</button><div data-docs-drawer-body></div></dialog>`,
  );
  const saved = new Map();
  for (const name of ['HTMLElement', 'HTMLDialogElement']) {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, value: view[name] });
  }
  t.after(() => {
    for (const [name, value] of saved) {
      if (value) Object.defineProperty(globalThis, name, value);
      else delete globalThis[name];
    }
  });
  const media = new view.EventTarget();
  media.matches = false;
  view.matchMedia = () => media;
  const drawer = view.document.querySelector('dialog');
  drawer.showModal = () => {
    drawer.open = true;
  };
  drawer.close = () => {
    drawer.open = false;
    drawer.dispatchEvent(new view.Event('close'));
  };
  const [{ installDocsShell }, { installDocsShellControls }] = await Promise.all([
    load('docs/src/components/shell/docs-shell.ts'),
    load('docs/src/components/shell/shell-controls.ts'),
  ]);
  t.after(installDocsShell(view.document));
  installDocsShellControls(view.document);
  const search = view.document.querySelector('[data-docs-search]');
  const input = view.document.querySelector('#component-search');
  search.click();
  assert.equal(drawer.open, true, 'the header Search opens the Drawer around the sidebar');
  assert.equal(view.document.activeElement, input, 'the field receives focus');
  drawer.close();
  assert.equal(view.document.activeElement, search, 'Close returns to the Search trigger');
  // The shortcut from another control still returns to that control.
  const menu = view.document.querySelector('[data-docs-menu-toggle]');
  menu.focus();
  view.document.dispatchEvent(
    new view.KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }),
  );
  assert.equal(drawer.open, true);
  drawer.close();
  assert.equal(view.document.activeElement, menu);
});

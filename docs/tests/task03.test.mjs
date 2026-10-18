import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import postcss from 'postcss';

const root = resolve(import.meta.dirname, '../..');
async function moduleAt(path) {
  const result = await build({
    entryPoints: [resolve(root, path)],
    bundle: true,
    write: false,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    jsx: 'automatic',
  });
  // Resolve external React imports from this repository, not a data URL.
  const file = resolve(root, 'docs/.task03-test-module.mjs');
  const { writeFile, unlink } = await import('node:fs/promises');
  await writeFile(file, result.outputFiles[0].text);
  try {
    return await import(`${new URL('file://' + file).href}?v=${Date.now()}-${Math.random()}`);
  } finally {
    await unlink(file);
  }
}

test('search opens collapsed matching groups without replacing user disclosure state', async () => {
  const { createComponentFilter } = await moduleAt('docs/src/components/shell/component-filter.ts');
  const dom = new JSDOM(
    `<input id="component-search"><button data-docs-search-clear hidden>Clear</button>
    <div data-docs-nav-scroll>
    <details class="nav-group" data-nav-group="Start" open><summary>Start</summary><ul><li><a aria-current="page">Home</a></li></ul></details>
    <details class="nav-group" data-nav-group="Actions"><summary>Actions</summary><ul><li data-component-link="Button button"><a>Button</a></li></ul></details>
    <details class="nav-group" data-nav-group="Layout"><summary>Layout</summary><ul><li data-component-link="Button layout"><a>Layout button</a></li></ul></details>
    </div><p id="search-status" hidden></p>`,
    { url: 'https://genux.test/' },
  );
  const { document } = dom.window;
  const filter = createComponentFilter(document);
  const group = document.querySelector('[data-nav-group="Actions"]');
  filter();
  document.querySelector('#component-search').value = 'button';
  filter();
  assert.equal(group.open, true, 'a match in a collapsed group is reachable');
  assert.equal(
    document.querySelectorAll('.nav-group[open]').length,
    1,
    'search keeps one group open',
  );
  assert.equal(document.querySelector('[data-nav-group="Start"]').hidden, true);
  document.querySelector('[data-docs-search-clear]').click();
  assert.equal(group.open, false, 'clearing restores the prior collapsed user state');
  assert.equal(document.querySelector('[data-nav-group="Start"]').open, true);
  assert.equal(document.activeElement.id, 'component-search');
  group.querySelector('summary').click();
  assert.equal(document.querySelector('[data-nav-group="Start"]').open, false);
  assert.equal(group.open, true);
  document.querySelector('[data-nav-group="Layout"] summary').click();
  assert.equal(group.open, false, 'opening another group collapses the previous one');
  assert.equal(document.querySelectorAll('.nav-group[open]').length, 1);
  dom.window.close();
});

test('install uses one headless picker and leaves all no-JS commands available', async () => {
  const markup = await readFile(resolve(root, 'docs/src/components/DocsInstall.astro'), 'utf8');
  assert.match(markup, /data-install-picker/);
  assert.equal((markup.match(/data-install-trigger/g) ?? []).length, 1);
  assert.doesNotMatch(markup, /aria-pressed/);
  assert.match(markup, /data-install-command=\{id\}/);
  const controller = await readFile(resolve(root, 'docs/src/components/docs-page.ts'), 'utf8');
  assert.match(controller, /installPackagePicker/);
});

test('every canonical human document has a real unique owner; component TSX controls page prose', async () => {
  const { components } = await moduleAt('docs/src/data/catalog.ts');
  const { componentTemplates, hubTemplates } = await moduleAt('docs/src/templates/registry.ts');
  assert.equal(Object.keys(componentTemplates).length, components.length);
  const owners = new Set();
  for (const component of components) {
    const entry = componentTemplates[component.slug];
    assert.ok(entry, component.slug);
    assert.match(entry.sourcePath, /\.tsx$/);
    await access(resolve(root, entry.sourcePath));
    assert.ok(!owners.has(entry.sourcePath), 'one distinct owner per component');
    owners.add(entry.sourcePath);
    const intro = renderToStaticMarkup(createElement(entry.Template, { part: 'introduction' }));
    assert.ok(intro.includes(`<h1`));
    assert.ok(intro.includes(component.title));
    const usage = renderToStaticMarkup(createElement(entry.Template, { part: 'usage' }));
    assert.ok(usage.includes('<li'), 'page owns meaningful usage prose');
    assert.ok(
      renderToStaticMarkup(createElement(entry.Template, { part: 'notes' })).includes('<li'),
    );
  }
  const policy = JSON.parse(await readFile(resolve(root, 'docs/src/data/url-policy.json'), 'utf8'));
  for (const page of policy.pages) {
    const owner =
      hubTemplates[page.id]?.sourcePath ??
      `docs/src/pages${page.path === '/' ? '/index' : page.path.replace(/\/$/, '')}${page.id === 'components' ? '/index' : ''}.astro`;
    await access(resolve(root, owner));
    assert.ok(!owners.has(owner), page.id + ' has a distinct editable owner');
    owners.add(owner);
  }
});

test('new disclosure and picker presentations reject local/one-way motion and keep reduced motion', async () => {
  const motion = JSON.parse(await readFile(resolve(root, 'docs/src/data/motion.json'), 'utf8'));
  assert.equal(motion.easing, 'cubic-bezier(0.65, 0, 0.35, 1)');
  assert.ok(motion.durationMs.standard > 0);
  for (const [file, selectors] of [
    [
      'docs/src/components/shell/nav.css',
      ['.sidebar .nav-group-chevron', '.sidebar .nav-group::details-content'],
    ],
    [
      'docs/src/styles/documentation.css',
      ['.docs-install-chevron', '.docs-install-options', '.docs-install-option'],
    ],
  ]) {
    const source = await readFile(resolve(root, file), 'utf8');
    const check = text => {
      const rules = postcss.parse(text);
      for (const selector of selectors) {
        let base = false;
        let reduced = false;
        rules.walkRules(rule => {
          if (
            !rule.selector
              .split(',')
              .map(value => value.trim())
              .includes(selector)
          )
            return;
          const inReduced =
            rule.parent.type === 'atrule' &&
            /prefers-reduced-motion:\s*reduce/.test(rule.parent.params);
          rule.walkDecls('transition', declaration => {
            if (inReduced) {
              reduced = declaration.value === 'none';
              return;
            }
            base = true;
            for (const transition of declaration.value.split(','))
              assert.match(transition, /var\(--transition-duration\)\s+var\(--motion-easing\)/);
          });
        });
        assert.ok(base && reduced, selector + ' owns both directions and reduced-motion exception');
      }
    };
    check(source);
    assert.throws(() => check(source.replaceAll('var(--motion-easing)', 'ease-out')));
  }
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('../../', import.meta.url));
const shell = await readFile(resolve(root, 'docs/src/components/shell/DocsShell.astro'), 'utf8');
const script = shell.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'exercise the actual shell entrypoint before and after extraction');
const compiled = await build({
  stdin: { contents: script, resolveDir: resolve(root, 'docs/src/components/shell'), loader: 'ts' },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  target: 'node24',
});

test('shell search and measured header preserve keyboard ownership and bfcache restoration', async t => {
  // Compose the real source slots without executing Astro expressions or requiring a prior
  // build. docs:verify runs docs:test before docs:build in a clean checkout.
  const [layout, nav] = await Promise.all([
    readFile(resolve(root, 'docs/src/layouts/DocsLayout.astro'), 'utf8'),
    readFile(resolve(root, 'docs/src/components/shell/DocsNav.astro'), 'utf8'),
  ]);
  const headerMarkup = layout.match(
    /<header\b[^>]*class="docs-header"[^>]*>[\s\S]*?<\/header>/,
  )?.[0];
  const searchField = nav.match(/<label class="nav-search">[\s\S]*?<\/label>/)?.[0];
  const frame = shell.match(/^---[\s\S]*?\n---\n([\s\S]*?)<script>/)?.[1];
  assert.ok(headerMarkup && searchField && frame, 'use actual shell, header and search markup');
  const body = frame
    .replace('<slot name="header" />', headerMarkup)
    .replace('<DocsNav slug={slug} />', searchField);
  const dom = new JSDOM(`<!doctype html><html><body>${body}</body></html>`, {
    url: 'https://genux.test/',
  });
  const { window } = dom;
  const { document } = window;
  const observers = [];
  class HeaderObserver {
    constructor(callback) {
      this.callback = callback;
      this.disconnected = false;
      observers.push(this);
    }
    observe(target) {
      this.target = target;
    }
    disconnect() {
      this.disconnected = true;
    }
  }
  window.matchMedia = media => ({
    media,
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  });
  // JSDOM has no native modal layout or ResizeObserver; simulate these two platform APIs.
  window.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new window.Event('close'));
  };
  const globals = new Map();
  for (const [name, value] of Object.entries({
    window,
    document,
    HTMLElement: window.HTMLElement,
    HTMLDialogElement: window.HTMLDialogElement,
    AbortController: window.AbortController,
    ResizeObserver: HeaderObserver,
  })) {
    globals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  }
  t.after(() => {
    window.dispatchEvent(new window.Event('pagehide'));
    window.close();
    for (const [name, descriptor] of globals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  });
  await import(
    'data:text/javascript;base64,' + Buffer.from(compiled.outputFiles[0].text).toString('base64')
  );
  const search = document.getElementById('component-search');
  const drawer = document.querySelector('[data-docs-drawer]');
  const toggle = document.querySelector('[data-docs-menu-toggle]');
  const trigger = document.querySelector('[data-docs-search]');
  const close = document.querySelector('[data-docs-menu-close]');
  const header = document.querySelector('.docs-header');
  const height = () => document.documentElement.style.getPropertyValue('--docs-header-height');
  const key = options => {
    const event = new window.KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
      ...options,
    });
    if (options?.handled) event.preventDefault();
    document.dispatchEvent(event);
    return event;
  };

  assert.equal(observers.length, 1);
  assert.equal(observers[0].target, header);
  header.getBoundingClientRect = () => ({ height: 176 });
  observers[0].callback();
  assert.equal(height(), '176px');
  search.value = 'input';
  trigger.click();
  assert.equal(drawer.open, true);
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(document.activeElement, search);
  assert.equal(search.value, 'input');
  close.click();
  // The trigger focused itself before opening (WebKit never does on click), so the Drawer
  // owner returns focus to the actual invoker rather than to Menu.
  assert.equal(document.activeElement, trigger);
  for (const options of [
    { handled: true },
    { isComposing: true },
    { altKey: true },
    { shiftKey: true },
    { ctrlKey: false },
  ]) {
    key(options);
    assert.equal(drawer.open, false);
    assert.equal(document.activeElement, trigger);
  }
  assert.equal(key({ metaKey: true, ctrlKey: false, key: 'K' }).defaultPrevented, true);
  assert.equal(document.activeElement, search);
  close.click();

  window.dispatchEvent(new window.Event('pagehide'));
  assert.equal(height(), '');
  assert.equal(observers[0].disconnected, true);
  trigger.click();
  assert.equal(key({}).defaultPrevented, false);
  assert.equal(drawer.open, false);
  window.dispatchEvent(new window.PageTransitionEvent('pageshow', { persisted: false }));
  assert.equal(observers.length, 1, 'ordinary pageshow does not duplicate shell controls');
  window.dispatchEvent(new window.PageTransitionEvent('pageshow', { persisted: true }));
  assert.equal(observers.length, 2);
  observers[1].callback();
  assert.equal(height(), '176px');
  assert.equal(key({}).defaultPrevented, true);
  assert.equal(drawer.open, true);
  assert.equal(document.activeElement, search);
  assert.equal(search.value, 'input');
});

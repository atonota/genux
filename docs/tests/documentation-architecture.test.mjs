import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// Dependency direction of the documentation application (docs/ARCHITECTURE.md): routes under
// docs/src/pages depend on layouts, components, data and shared modules, never the reverse.
// A view or shared module that imports a route module couples it to Astro's routing and
// publishes the route's build-time exports through every consumer.
const root = fileURLToPath(new URL('../../', import.meta.url));
const source = resolve(root, 'docs/src');
const pages = resolve(source, 'pages');
const modulePattern = /\.(?:astro|ts|tsx|mjs)$/;
const specifierPattern = /\b(?:from|import)\s*\(?\s*(['"])(\.{1,2}\/[^'"]*)\1/g;

async function modules(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const found = await Promise.all(
    entries.map(entry => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return path === pages ? [] : modules(path);
      return modulePattern.test(entry.name) && !entry.name.endsWith('.d.ts') ? [path] : [];
    }),
  );
  return found.flat();
}

test('no module outside docs/src/pages imports a route module from docs/src/pages', async () => {
  const files = await modules(source);
  assert.ok(files.length > 100, 'the scan covers the documentation application sources');
  const violations = [];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    for (const match of text.matchAll(specifierPattern)) {
      const target = resolve(dirname(file), match[2]);
      const inside = relative(pages, target);
      if (inside && !inside.startsWith('..') && !inside.startsWith(sep))
        violations.push(`${relative(root, file)} -> ${match[2]}`);
    }
  }
  assert.deepEqual(violations, []);
});

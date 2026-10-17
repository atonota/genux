// Build-time allowlist of the documentation sources published as read-only text copies by the
// source route (pages/source/[...path].txt.ts) and linked from component pages, page tools and
// Code payloads. The glob is a fixed set of docs directories relative to this module; nothing
// outside it is published and no file is read at request time. This module is not a route, so
// views and other routes depend on it without depending on Astro routing.
const loaders = import.meta.glob<string>(
  [
    './react/**/*.{ts,tsx}',
    './styles/**/*.css',
    './data/**/*.{ts,json}',
    './genux/**/*.ts',
    './fab/**/*.ts',
    './layouts/*.astro',
    './components/*.astro',
    './pages/components/*.astro',
    './theme.ts',
    '../AGENTS.md',
    '../tests/*.test.mjs',
    '../tests/fab-harness.mjs',
    '../browser/*.spec.ts',
  ],
  { query: '?raw', import: 'default' },
);

// Glob keys are relative to docs/src; published paths are relative to docs.
const roots: ReadonlyArray<readonly [prefix: string, base: string]> = [
  ['../', ''],
  ['./', 'src/'],
];
const publishedPath = (key: string) => {
  const [prefix, base] = roots.find(([prefix]) => key.startsWith(prefix)) ?? ['', ''];
  return base + key.slice(prefix.length);
};

/** Published docs-relative path to its raw text loader. */
export const publishedSources: ReadonlyMap<string, () => Promise<string>> = new Map(
  Object.entries(loaders).map(([key, load]) => [publishedPath(key), load] as const),
);

/** Link for a docs/-prefixed source path, or undefined when it is not published. */
export const sourceHref = (docsPath: string) => {
  if (!docsPath.startsWith('docs/')) return undefined;
  const path = docsPath.slice('docs/'.length);
  if (!publishedSources.has(path)) return undefined;
  return '/source/' + path.split('/').map(encodeURIComponent).join('/') + '.txt';
};

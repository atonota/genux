import { translate } from '../i18n';

// Component page behaviour for pages/components/[slug].astro: four tabs over the eight
// server-rendered sections, active-tab filtering of the existing section and contents links,
// copy as Markdown and the shared package manager. Without it every section stays readable.
const defaultTab = 'examples';

const text = (node: Element) => (node.textContent ?? '').trim().split(/\s+/).join(' ');
// Headings, paragraphs and list items keep their inline destinations and code spans; the
// anchor's resolved href names the real page, not a route-relative path.
const inline = (node: Element): string => {
  let out = '';
  for (const child of node.childNodes) {
    if (child.nodeType === child.TEXT_NODE) out += child.textContent ?? '';
    if (child.nodeType !== child.ELEMENT_NODE) continue;
    const element = child as Element;
    if (element.localName === 'a' && element.hasAttribute('href'))
      out += `[${inline(element)}](${(element as HTMLAnchorElement).href})`;
    else if (element.localName === 'code') out += '`' + (element.textContent ?? '') + '`';
    else out += inline(element);
  }
  return out;
};
const line = (node: Element) => inline(node).trim().split(/\s+/).join(' ');
const prefixes: Record<string, string> = { h1: '# ', h2: '## ', h3: '### ', li: '- ' };
// Table cells escape backslashes and pipes so union types in API columns stay one cell each;
// text() already folds line breaks into single spaces.
const cell = (node: Element) => text(node).replace(/[\\|]/g, '\\$&');

/** Markdown of the whole article, every tab included; live demos and controls are skipped. */
function toMarkdown(article: HTMLElement): string {
  const blocks: string[] = [];
  const nodes = article.querySelectorAll<HTMLElement>('h1, h2, h3, p, li, pre, tr');
  for (const node of nodes) {
    if (
      node.closest(
        '[data-doc-demo], .genux-demo, astro-island, [data-doc-tools], [data-install-picker], .page-breadcrumb, .page-neighbors, footer, [data-doc-contents], [data-doc-tabs]',
      ) ||
      node.parentElement?.closest('pre, li, tr')
    )
      continue;
    if (node.localName === 'pre') blocks.push('```\n' + (node.textContent ?? '').trim() + '\n```');
    else if (node.localName === 'tr') {
      const cells = [...node.children].map(cell);
      const row = `| ${cells.join(' | ')} |`;
      if (node.parentElement?.localName === 'thead')
        blocks.push(row + '\n|' + ' --- |'.repeat(cells.length));
      else blocks.push((blocks.pop() ?? '') + '\n' + row);
    } else blocks.push((prefixes[node.localName] ?? '') + line(node));
  }
  return blocks.join('\n\n') + '\n';
}

/** Wires tabs, link filtering, copy and install choice; the disposer restores the SSR state. */
export function installDocsPage(root: Document): () => void {
  const view = root.defaultView;
  const article = root.querySelector<HTMLElement>('[data-component-detail], [data-doc-article]');
  const list = article?.querySelector<HTMLElement>('[data-doc-tabs]');
  if (!view || !article || article.hasAttribute('data-doc-page-ready')) return () => {};

  const articleTools = article.querySelector('[data-doc-tools="article"]');
  const contents = article.querySelector('[data-doc-contents]');
  if (articleTools && contents) contents.after(articleTools);

  const tabs = [...(list?.querySelectorAll<HTMLButtonElement>('[data-doc-tab]') ?? [])];
  const panels = [...article.querySelectorAll<HTMLElement>('[data-doc-panel]')];
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-doc-nav] a[href^="#"]')];
  const install = article.querySelector<HTMLElement>('[data-install]');
  const controller = new AbortController();
  const { signal } = controller;

  const hashId = () => {
    try {
      return decodeURIComponent(view.location.hash.slice(1));
    } catch {
      return '';
    }
  };
  // The tab that owns a section id; legacy section hashes and contents links resolve here.
  const groupOf = (id: string) =>
    id
      ? root.getElementById(id)?.closest<HTMLElement>('[data-doc-panel]')?.dataset.docPanel
      : undefined;
  const activate = (group: string) => {
    for (const tab of tabs) {
      const selected = tab.dataset.docTab === group;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    for (const panel of panels) {
      panel.hidden = panel.dataset.docPanel !== group;
      panel.inert = panel.hidden;
    }
    for (const link of links) link.hidden = groupOf(link.hash.slice(1)) !== group;
  };
  // A section hash wins over ?tab=; an unknown or missing tab falls back to Examples.
  const follow = () => {
    const id = hashId();
    const query = new URLSearchParams(view.location.search).get('tab');
    const named = tabs.find(tab => tab.dataset.docTab === query)?.dataset.docTab;
    activate(groupOf(id) ?? named ?? defaultTab);
    if (id) root.getElementById(id)?.scrollIntoView();
  };
  const select = (
    mode: 'pushState' | 'replaceState',
    tab: HTMLButtonElement | null | undefined,
  ) => {
    const group = tab?.dataset.docTab;
    if (!group) return;
    activate(group);
    const url = new URL(view.location.href);
    url.searchParams.set('tab', group);
    url.hash = '';
    view.history[mode](null, '', url);
    // pushState/replaceState do not emit hashchange; the shell reflects the actual
    // location after this sole tab/history owner has cleared the fragment.
    article.dispatchEvent(new view.CustomEvent('genux-doc-location-change', { bubbles: true }));
  };
  const keys: Record<string, (index: number) => number> = {
    ArrowLeft: index => (index + tabs.length - 1) % tabs.length,
    ArrowRight: index => (index + 1) % tabs.length,
    Home: () => 0,
    End: () => tabs.length - 1,
  };

  list?.addEventListener(
    'click',
    event =>
      select('pushState', (event.target as Element).closest<HTMLButtonElement>('[data-doc-tab]')),
    { signal },
  );
  list?.addEventListener(
    'keydown',
    event => {
      const move = keys[event.key];
      const index = tabs.indexOf(event.target as HTMLButtonElement);
      if (!move || index < 0) return;
      event.preventDefault();
      const tab = tabs[move(index)];
      select('replaceState', tab);
      tab?.focus();
    },
    { signal },
  );
  if (list) {
    view.addEventListener('hashchange', follow, { signal });
    view.addEventListener('popstate', follow, { signal });
  }

  const clipboard = view.navigator.clipboard as Clipboard | undefined;
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-doc-copy-markdown]')) {
    if (typeof clipboard?.writeText !== 'function') break;
    const status = button.parentElement?.querySelector('[data-doc-copy-status]');
    const report = (message: string) => {
      const span = root.createElement('span');
      span.dataset.i18n = message;
      span.textContent = translate(message);
      status?.replaceChildren(span);
    };
    button.hidden = false;
    button.addEventListener(
      'click',
      async () => {
        if (status) status.textContent = '';
        try {
          await clipboard.writeText(toMarkdown(article));
          report('Markdown copied.');
        } catch {
          report('Copy failed.');
        }
      },
      { signal },
    );
  }

  let disposePicker = () => {};
  if (install) {
    void import('./install-picker')
      .then(({ installPackagePicker }) => {
        if (!signal.aborted) disposePicker = installPackagePicker(install);
      })
      .catch(() => {
        // If the enhancement cannot load, all server-rendered commands remain readable.
      });
  }

  // Sections become tabpanels named by their tab and heading only while the tabs work; the
  // server markup keeps its plain labelled sections and the disposer restores them.
  const original = panels.map(panel => ({
    panel,
    role: panel.getAttribute('role'),
    labelledBy: panel.getAttribute('aria-labelledby'),
  }));
  for (const { panel, labelledBy } of original) {
    const owner = tabs.find(tab => tab.dataset.docTab === panel.dataset.docPanel);
    if (!owner?.id) continue;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', [owner.id, labelledBy].filter(Boolean).join(' '));
  }
  const restore = (node: Element, name: string, value: string | null) =>
    value === null ? node.removeAttribute(name) : node.setAttribute(name, value);

  if (list) list.hidden = false;
  article.setAttribute('data-doc-page-ready', '');
  if (list) follow();

  return () => {
    controller.abort();
    disposePicker();
    for (const node of [...panels, ...links]) node.hidden = false;
    for (const panel of panels) panel.inert = false;
    for (const { panel, role, labelledBy } of original) {
      restore(panel, 'role', role);
      restore(panel, 'aria-labelledby', labelledBy);
    }
    if (list) list.hidden = true;
    article.removeAttribute('data-doc-page-ready');
  };
}

/** Guide Contents enhances the existing section navigation; no new scroll or history store. */
export function installGuideContents(document: Document): void {
  const grid = document.querySelector<HTMLElement>('[data-docs-guide-grid]');
  const article = grid?.querySelector('[data-doc-article]');
  const tools = article?.querySelector('[data-doc-tools="article"]');
  const intro =
    article?.querySelector('[data-doc-contents]') ?? article?.querySelector('.lead, h1');
  if (tools && intro) intro.after(tools);
  const list = grid?.querySelector<HTMLElement>('[data-shell-contents-list]');
  const nav = grid?.querySelector<HTMLElement>('[data-shell-contents-nav]');
  if (!grid || !list || !nav) return;
  const links = grid.querySelectorAll<HTMLAnchorElement>('[data-doc-nav="sections"] a[href^="#"]');
  list.replaceChildren();
  for (const link of links) {
    let id: string;
    try {
      id = decodeURIComponent(link.hash.slice(1));
    } catch {
      continue;
    }
    if (!id || !document.getElementById(id)) continue;
    list.append(link.cloneNode(true));
  }
  nav.hidden = list.childElementCount === 0;
  grid.toggleAttribute('data-shell-contents-ready', !nav.hidden);
}

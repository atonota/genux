/** Native fragment navigation owns history/scroll; this enhancement owns location and focus. */
export function installSectionNavigation(document: Document): () => void {
  const view = document.defaultView;
  if (!view) return () => {};
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-doc-nav] a[href^="#"]')];
  const controller = new view.AbortController();
  const { signal } = controller;
  const targets = new Set<HTMLElement>();
  const targetOf = (hash: string) => {
    try {
      return hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    } catch {
      return null;
    }
  };
  const reflect = () => {
    const current = targetOf(view.location.hash);
    for (const link of links) {
      if (current && targetOf(link.hash) === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  for (const link of links) {
    link.addEventListener(
      'click',
      event => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const section = targetOf(link.hash);
        if (!section || section.closest('[hidden], [inert]')) return;
        const heading = section.matches('h1, h2, h3')
          ? section
          : section.querySelector<HTMLElement>('h1, h2, h3');
        if (!heading) return;
        if (!section.hasAttribute('tabindex')) {
          section.tabIndex = -1;
          targets.add(section);
          section.setAttribute('data-shell-section-target', '');
        }
        // Native activation still updates the hash and scrolls using the shared offset.
        // Closing the source disclosure first gives that scroll its final layout.
        const disclosure = link.closest('details');
        if (disclosure) disclosure.open = false;
        // Focus the indicated part itself, as native fragment navigation does; focusing
        // an inner heading here could be superseded by the link's default focusing steps.
        section.focus({ preventScroll: true });
      },
      { signal },
    );
  }
  view.addEventListener('hashchange', reflect, { signal });
  view.addEventListener('popstate', reflect, { signal });
  document.addEventListener('genux-doc-location-change', reflect, { signal });
  reflect();
  return () => {
    controller.abort();
    for (const link of links) link.removeAttribute('aria-current');
    for (const target of targets) {
      target.removeAttribute('tabindex');
      target.removeAttribute('data-shell-section-target');
    }
  };
}

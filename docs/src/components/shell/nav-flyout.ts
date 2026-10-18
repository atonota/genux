/** Hover is an additional route into closed navigation groups. Native disclosures remain
 * the click/keyboard/touch owner; the top-layer copy escapes the sidebar's scroll clipping. */
export function createNavFlyout(root: Document, groups: HTMLDetailsElement[]): () => void {
  const view = root.defaultView;
  const navigation = root.querySelector('.navigation nav');
  if (!view || !navigation || !('showPopover' in HTMLElement.prototype)) return () => {};

  const capability = view.matchMedia(
    '(min-width: 54.6875rem) and (any-hover: hover) and (any-pointer: fine)',
  );
  const panel = root.createElement('div');
  panel.className = 'nav-flyout';
  panel.popover = 'auto';
  panel.setAttribute('role', 'navigation');
  navigation.append(panel);
  let owner: HTMLDetailsElement | null = null;
  let timer = 0;
  const cancelClose = () => {
    view.clearTimeout(timer);
    timer = 0;
  };
  const close = () => {
    cancelClose();
    if (panel.matches(':popover-open')) panel.hidePopover();
    owner?.removeAttribute('data-nav-hover');
    owner = null;
  };
  const scheduleClose = () => {
    cancelClose();
    timer = view.setTimeout(() => {
      // A reader can move into the links and switch to keyboard without losing focus.
      if (!panel.contains(root.activeElement)) close();
    }, 150);
  };
  for (const group of groups) {
    const summary = group.querySelector('summary');
    summary?.addEventListener('pointerenter', event => {
      if ((event as PointerEvent).pointerType === 'touch' || !capability.matches) return;
      cancelClose();
      if (group === owner) return;
      close();
      if (group.open || group.hidden) return;
      const links = group.querySelector('ul')?.cloneNode(true);
      if (!links) return;
      // Search and ordinary navigation keep their single canonical source list.
      if (links instanceof Element) {
        links.querySelectorAll('[data-component-link]').forEach(item => {
          item.removeAttribute('data-component-link');
        });
      }
      panel.replaceChildren(links);
      panel.setAttribute('aria-label', summary.querySelector('h2')?.textContent ?? '');
      owner = group;
      group.setAttribute('data-nav-hover', '');
      panel.showPopover();
      const box = summary.getBoundingClientRect();
      const inset = Number.parseFloat(view.getComputedStyle(panel).paddingTop) || 0;
      panel.style.left = `${box.right}px`;
      panel.style.top = `${Math.max(inset, Math.min(box.top, view.innerHeight - panel.offsetHeight - inset))}px`;
    });
    summary?.addEventListener('pointerleave', scheduleClose);
    summary?.addEventListener('click', close);
    group.addEventListener('toggle', () => {
      if (group === owner && group.open) close();
    });
  }
  panel.addEventListener('pointerenter', cancelClose);
  panel.addEventListener('pointerleave', scheduleClose);
  panel.addEventListener('focusout', () => {
    view.queueMicrotask(() => {
      if (!panel.contains(root.activeElement) && !panel.matches(':hover')) close();
    });
  });
  panel.addEventListener('beforetoggle', event => {
    if ((event as ToggleEvent).newState === 'closed') {
      owner?.removeAttribute('data-nav-hover');
      owner = null;
    }
  });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
  });
  root.addEventListener(
    'scroll',
    event => {
      if (!panel.contains(event.target as Node)) close();
    },
    true,
  );
  view.addEventListener('resize', close);
  view.addEventListener('pagehide', close);
  capability.addEventListener('change', close);
  return close;
}

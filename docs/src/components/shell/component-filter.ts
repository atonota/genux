import { normalizeSearch } from '../../i18n';

/** One canonical query; ordinary projection preserves focus, explicit recovery returns to the field. */
export function createComponentFilter(document: Document): () => void {
  const search = document.querySelector<HTMLInputElement>('#component-search');
  const clear = document.querySelector<HTMLButtonElement>('[data-docs-search-clear]');
  const storageKey = 'genux-docs-component-query';
  const view = document.defaultView;
  try {
    // A browser-restored field takes precedence over this tab's last query.
    if (search && !search.value) search.value = view?.sessionStorage.getItem(storageKey) ?? '';
  } catch {
    // Filtering remains available when session storage is blocked.
  }
  let previousTerm = normalizeSearch(search?.value ?? '');
  const filterComponents = () => {
    const term = normalizeSearch(search?.value ?? '');
    try {
      if (term) view?.sessionStorage.setItem(storageKey, search?.value ?? '');
      else view?.sessionStorage.removeItem(storageKey);
    } catch {
      // Query memory is optional, never a prerequisite for finding a component.
    }
    if (term && term !== previousTerm) {
      const scroller = document.querySelector<HTMLElement>('[data-docs-nav-scroll]');
      if (scroller) scroller.scrollTop = 0;
    }
    previousTerm = term;
    if (clear) clear.hidden = term.length === 0;
    let visible = 0;
    document.querySelectorAll<HTMLElement>('[data-component-link]').forEach(item => {
      const names = (item.dataset.componentLink ?? '') + ' ' + (item.textContent ?? '');
      item.hidden = !normalizeSearch(names).includes(term);
      if (!item.hidden) visible++;
    });
    document.querySelectorAll<HTMLElement>('.nav-group').forEach(group => {
      // During component search the matching groups follow the field directly. Clearing
      // restores the full documentation navigation, including all foundation destinations.
      group.hidden = group.querySelector('[data-component-link]')
        ? !group.querySelector('[data-component-link]:not([hidden])')
        : term.length > 0;
    });
    const status = document.querySelector<HTMLElement>('#search-status');
    if (status) status.hidden = visible > 0;
  };
  clear?.addEventListener('click', () => {
    if (!search) return;
    search.value = '';
    filterComponents();
    search.focus();
  });
  return filterComponents;
}

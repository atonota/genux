import { normalizeSearch } from '../../i18n';

/** One canonical query; ordinary projection preserves focus, explicit recovery returns to the field. */
export function createComponentFilter(document: Document): () => void {
  const search = document.querySelector<HTMLInputElement>('#component-search');
  const clear = document.querySelector<HTMLButtonElement>('[data-docs-search-clear]');
  const filterComponents = () => {
    const term = normalizeSearch(search?.value ?? '');
    if (clear) clear.hidden = term.length === 0;
    let visible = 0;
    document.querySelectorAll<HTMLElement>('[data-component-link]').forEach(item => {
      const names = (item.dataset.componentLink ?? '') + ' ' + (item.textContent ?? '');
      item.hidden = !normalizeSearch(names).includes(term);
      if (!item.hidden) visible++;
    });
    document.querySelectorAll<HTMLElement>('.nav-group').forEach(group => {
      // Foundation groups have no component links; component search must not hide them.
      if (!group.querySelector('[data-component-link]')) return;
      group.hidden = !group.querySelector('[data-component-link]:not([hidden])');
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

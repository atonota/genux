import { createNavFlyout } from './nav-flyout';

/** Native disclosures keep links usable without JS. Search projects a temporary open state;
 * the reader's ordinary choices stay separate and survive navigation within this session. */
export function createNavGroups(root: Document): (searching: boolean) => void {
  const groups = [...root.querySelectorAll<HTMLDetailsElement>('details[data-nav-group]')];
  const closeFlyout = createNavFlyout(root, groups);
  const view = root.defaultView;
  const key = 'genux-docs-nav-groups';
  let stored: Record<string, boolean> = {};
  try {
    const value: unknown = JSON.parse(view?.sessionStorage.getItem(key) ?? '{}');
    if (value && typeof value === 'object' && !Array.isArray(value))
      stored = Object.fromEntries(
        Object.entries(value).filter(([, open]) => typeof open === 'boolean'),
      );
  } catch {
    // A denied or invalid saved preference never prevents native disclosure.
  }
  // The current route wins over older sessions that saved several expanded groups.
  const initial =
    groups.find(group => group.querySelector('[aria-current="page"]')) ??
    groups.find(group => stored[group.dataset.navGroup ?? ''] ?? group.open);
  const desired = new Map(groups.map(group => [group, group === initial]));
  let searching = false;
  for (const group of groups) {
    group.name = 'docs-navigation-groups';
    group.open = desired.get(group) ?? false;
    group.querySelector('summary')?.addEventListener('click', () => {
      const opening = !group.open;
      if (opening) {
        for (const other of groups) {
          if (other !== group) {
            other.open = false;
            if (!searching) desired.set(other, false);
          }
        }
      }
      if (searching) return;
      desired.set(group, opening);
      try {
        view?.sessionStorage.setItem(
          key,
          JSON.stringify(
            Object.fromEntries(
              groups.map(item => [item.dataset.navGroup ?? '', desired.get(item)]),
            ),
          ),
        );
      } catch {
        // In-memory choices still work when storage is blocked.
      }
    });
  }
  return active => {
    closeFlyout();
    searching = active;
    const selected = active
      ? (groups.find(group => !group.hidden && group.open) ?? groups.find(group => !group.hidden))
      : groups.find(group => desired.get(group));
    for (const group of groups) group.open = group === selected;
  };
}

/** Native disclosures keep links usable without JS. Search projects a temporary open state;
 * the reader's ordinary choices stay separate and survive navigation within this session. */
export function createNavGroups(root: Document): (searching: boolean) => void {
  const groups = [...root.querySelectorAll<HTMLDetailsElement>('details[data-nav-group]')];
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
  const desired = new Map(
    groups.map(group => [
      group,
      !!group.querySelector('[aria-current="page"]') ||
        (stored[group.dataset.navGroup ?? ''] ?? group.open),
    ]),
  );
  let searching = false;
  for (const group of groups) {
    group.open = desired.get(group) ?? false;
    group.querySelector('summary')?.addEventListener('click', () => {
      if (searching) return;
      desired.set(group, !group.open);
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
    searching = active;
    for (const group of groups) group.open = active ? !group.hidden : (desired.get(group) ?? false);
  };
}

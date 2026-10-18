/** Header search and measured height belong to the shell, with their existing bfcache lifecycle. */
export function installDocsShellControls(document: Document): void {
  // Search documentation: the header button and Cmd/Ctrl+K focus the canonical sidebar search.
  // Below the breakpoint the sidebar lives in the closed Drawer, which the menu toggle opens.
  // One listener set per document; pagehide removes it and a restored page reinstalls it.
  const focusSearch = (invoker?: HTMLElement) => {
    const input = document.getElementById('component-search');
    if (!input) return;
    const drawer = input.closest('dialog');
    if (drawer && !drawer.open) {
      // The Drawer owner returns focus to the element focused when it opened. WebKit does
      // not focus a button on pointer click, so the trigger takes focus before opening;
      // the shortcut path keeps whatever control had focus.
      invoker?.focus({ preventScroll: true });
      document.querySelector<HTMLButtonElement>('[data-docs-menu-toggle]')?.click();
    }
    input.focus();
  };
  const installSearch = () => {
    const controller = new AbortController();
    const { signal } = controller;
    const trigger = document.querySelector<HTMLElement>('[data-docs-search]');
    trigger?.addEventListener('click', () => focusSearch(trigger), { signal });
    document.addEventListener(
      'keydown',
      event => {
        if (event.defaultPrevented || event.isComposing || event.altKey || event.shiftKey) return;
        if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
        event.preventDefault();
        focusSearch();
      },
      { signal },
    );
    return () => controller.abort();
  };
  // The single owner of --docs-header-height: the sticky header's actual, possibly wrapped
  // height, read by the sticky rails and section scroll margins in the shell CSS.
  const installHeaderHeight = () => {
    const header = document.querySelector<HTMLElement>('[data-docs-shell] .docs-header');
    const style = document.documentElement.style;
    if (!header || typeof ResizeObserver === 'undefined') return () => {};
    const observer = new ResizeObserver(() => {
      style.setProperty('--docs-header-height', `${header.getBoundingClientRect().height}px`);
    });
    observer.observe(header);
    return () => {
      observer.disconnect();
      style.removeProperty('--docs-header-height');
    };
  };
  const install = () => {
    const disposers = [installSearch(), installHeaderHeight()];
    return () => disposers.forEach(dispose => dispose());
  };
  let disposeShell = install();
  window.addEventListener('pagehide', () => disposeShell());
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    disposeShell();
    disposeShell = install();
  });
}

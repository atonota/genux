import { translate } from '../i18n';

/** Bind once for the document lifetime, including bfcache: keep each code block's live status. */
export function installCodeCopy(document: Document): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button, index) => {
    const status = document.createElement('span');
    let statusIndex = index;
    while (document.getElementById(`code-copy-status-${statusIndex}`)) statusIndex++;
    status.id = `code-copy-status-${statusIndex}`;
    status.className = 'copy-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    status.setAttribute('aria-label', translate('Code copy status'));
    status.dataset.i18nAriaLabel = 'Code copy status';
    button.insertAdjacentElement('afterend', status);
    button.setAttribute(
      'aria-describedby',
      [...new Set([...(button.getAttribute('aria-describedby') ?? '').split(/\s+/), status.id])]
        .filter(Boolean)
        .join(' '),
    );
    button.addEventListener('click', async () => {
      const code = button.parentElement?.querySelector('code')?.textContent;
      if (!code) return;
      delete status.dataset.i18n;
      status.textContent = '';
      let message = 'Copied';
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        message = 'Select the code to copy';
      }
      button.dataset.i18n = message;
      button.textContent = translate(message);
      status.dataset.i18n = message;
      status.textContent = translate(message);
    });
  });
}

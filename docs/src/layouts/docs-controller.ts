import { installDeferredFeedback } from '../deferred-feedback';
import { getThemeSnapshot, setTheme, subscribeTheme } from '../theme';
import { initializeThemeBuilder } from '../theme-builder/store';
import { getLocaleSnapshot, restoreLocale, setLocale, subscribeLocale, translate } from '../i18n';
import { createComponentFilter } from '../components/shell/component-filter';
import { installCodeCopy } from '../components/code-copy';
import { installOverlayBackdrop } from '../overlay-backdrop';
import { installInputModality } from '../input-modality';
import shellTurkish from '../locales/tr/shell-ux.json';

/** Document composition: preserve preference subscriptions and existing page lifecycle ordering. */
export function installDocsController(document: Document): void {
  const themeToggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  let disposeFeedback = installDeferredFeedback(document);
  let disposeThemeBuilder: (() => void) | null = initializeThemeBuilder();
  const updateThemeToggle = () => {
    const dark = getThemeSnapshot() === 'dark';
    themeToggle?.setAttribute('aria-checked', String(dark));
  };
  const search = document.querySelector<HTMLInputElement>('#component-search');
  const filterComponents = createComponentFilter(document);
  const localeButtons = document.querySelectorAll<HTMLButtonElement>('[data-locale-button]');
  const localeStatus = document.querySelector<HTMLElement>('[data-locale-status]');
  const updateLocaleControls = () => {
    const locale = getLocaleSnapshot();
    localeButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.localeButton === locale));
    });
    updateThemeToggle();
    for (const node of document.querySelectorAll<HTMLElement>('[data-shell-i18n]')) {
      const message = node.dataset.shellI18n ?? '';
      node.textContent =
        locale === 'tr' ? ((shellTurkish as Record<string, string>)[message] ?? message) : message;
    }
    filterComponents();
  };
  const showLocaleError = () => {
    if (!localeStatus) return;
    localeStatus.dataset.i18n = 'Could not load this language.';
    localeStatus.textContent = translate('Could not load this language.');
    localeStatus.hidden = false;
  };
  let localeRequest = 0;
  localeButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const locale = button.dataset.localeButton;
      if (locale !== 'en' && locale !== 'tr') return;
      const request = ++localeRequest;
      try {
        await setLocale(locale);
        if (request === localeRequest && localeStatus) localeStatus.hidden = true;
      } catch {
        if (request === localeRequest) showLocaleError();
      }
    });
  });
  installOverlayBackdrop();
  // One document-wide modality owner for the page; it stays installed across bfcache restores.
  installInputModality(document);
  updateThemeToggle();
  updateLocaleControls();
  let unsubscribeTheme = subscribeTheme(updateThemeToggle);
  let unsubscribeLocale = subscribeLocale(updateLocaleControls);
  void restoreLocale().catch(() => {
    if (localeRequest === 0) showLocaleError();
  });
  themeToggle?.addEventListener('click', () => {
    setTheme(getThemeSnapshot() === 'dark' ? 'light' : 'dark');
  });
  window.addEventListener('pagehide', () => {
    disposeFeedback();
    disposeThemeBuilder?.();
    disposeThemeBuilder = null;
    unsubscribeTheme();
    unsubscribeLocale();
  });
  window.addEventListener('pageshow', () => {
    disposeFeedback();
    disposeFeedback = installDeferredFeedback(document);
    disposeThemeBuilder ??= initializeThemeBuilder();
    unsubscribeTheme();
    unsubscribeLocale();
    unsubscribeTheme = subscribeTheme(updateThemeToggle);
    unsubscribeLocale = subscribeLocale(updateLocaleControls);
    updateLocaleControls();
  });
  search?.addEventListener('input', filterComponents);
  installCodeCopy(document);
}

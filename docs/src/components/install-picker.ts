import * as select from '@zag-js/select';
import { VanillaMachine, normalizeProps, spreadProps } from '@zag-js/vanilla';
import { readMigratedItem } from '../storage-migration';

const managers = ['npm', 'yarn', 'pnpm', 'bun'];
const storageKey = 'genux-package-manager';

/** The installed headless machine owns APG keys, typeahead, dismissal and return focus.
 * Only command projection/persistence belongs to this documentation adapter. */
export function installPackagePicker(install: HTMLElement): () => void {
  const picker = install.querySelector<HTMLElement>('[data-install-picker]');
  const trigger = picker?.querySelector<HTMLButtonElement>('[data-install-trigger]');
  const label = picker?.querySelector<HTMLElement>('[data-install-label]');
  const control = picker?.querySelector<HTMLElement>('[data-install-control]');
  const positioner = picker?.querySelector<HTMLElement>('[data-install-positioner]');
  const options = picker?.querySelector<HTMLElement>('[data-install-options]');
  const value = picker?.querySelector<HTMLElement>('[data-install-value]');
  const view = install.ownerDocument.defaultView;
  if (!picker || !trigger || !label || !control || !positioner || !options || !value || !view)
    return () => {};
  const commands = [...install.querySelectorAll<HTMLElement>('[data-install-command]')];
  const items = [...picker.querySelectorAll<HTMLElement>('[data-install-manager]')];
  let initial = 'npm';
  try {
    const stored = readMigratedItem(view.localStorage, storageKey);
    if (stored && managers.includes(stored)) initial = stored;
  } catch {
    // Blocked storage does not prevent selection.
  }
  const project = (manager: string) => {
    value.textContent = manager;
    for (const command of commands) command.hidden = command.dataset.installCommand !== manager;
  };
  const machine = new VanillaMachine(select.machine, {
    id: 'docs-package-manager',
    collection: select.collection({ items: managers }),
    defaultValue: [initial],
    getRootNode: () => install.ownerDocument,
    positioning: { placement: 'bottom-end' },
    onValueChange(details) {
      const manager = details.value[0] ?? 'npm';
      project(manager);
      try {
        view.localStorage.setItem(storageKey, manager);
      } catch {
        // This page's choice remains usable without persistence.
      }
    },
  });
  const cleanups = new Map<Element, () => void>();
  const bind = (node: Element, props: Parameters<typeof spreadProps>[1]) => {
    cleanups.set(node, spreadProps(node, props, 'docs-package-manager'));
  };
  const render = () => {
    const api = select.connect(machine.service, normalizeProps);
    bind(picker, api.getRootProps());
    bind(control, api.getControlProps());
    bind(label, api.getLabelProps());
    bind(trigger, api.getTriggerProps());
    bind(positioner, api.getPositionerProps());
    // The engine's own hidden state drives the stylesheet's discrete exit; a closing list is
    // inert immediately so its fade never accepts focus or activation.
    bind(options, { ...api.getContentProps(), inert: !api.open });
    for (const item of items)
      bind(item, api.getItemProps({ item: item.dataset.installManager ?? '' }));
    project(api.value[0] ?? 'npm');
  };
  const unsubscribe = machine.subscribe(render);
  machine.start();
  render();
  picker.hidden = false;
  return () => {
    unsubscribe();
    machine.stop();
    for (const cleanup of cleanups.values()) cleanup();
    picker.hidden = true;
    for (const command of commands) command.hidden = false;
  };
}

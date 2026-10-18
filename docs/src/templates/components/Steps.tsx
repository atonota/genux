// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Steps';
export const description =
  'Make a sequence easy to follow. Show the current step, explain what comes next and keep completed work available when someone goes back.';

export default function Steps({ part }: TemplateProps) {
  if (part === 'introduction')
    return (
      <>
        <h1 data-i18n={title}>{title}</h1>
        <p className="lead" data-i18n={description}>
          {description}
        </p>
      </>
    );
  if (part === 'usage')
    return (
      <DocumentationList
        items={[
          'For a task with a meaningful order, such as setup, review or approval.',
          'Use short titles and useful descriptions. Keep the current task and its next action beside the progress indicator.',
          'Use clickable steps only when people can safely revisit them. Explain unavailable steps and preserve entered information.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'The current step exposes aria-current=step. Text status distinguishes finished, current, waiting and error states without relying on color.',
          'Tab reaches available interactive steps. Arrows and Home/End move focus without changing selection; Enter and Space activate the focused step.',
          'Unavailable steps cannot activate and remain explained. Keyboard focus uses one immediate non-surrounding marker.',
          'Narrow containers stack steps without hiding titles, shrinking targets or duplicating the form. Back preserves entered information.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'These examples are local demonstrations. They do not create a workspace, contact a backend or represent a live operation.',
          'The shared sm/md/lg profile supplies 32/40/50px markers and at least 48/56/64px interactive targets. Native Steps has no large size prop.',
          'Auto layout starts vertical in SSR and measures the actual container after hydration. Short landscape viewports keep a stacked journey.',
          'Native 6.6.6 activation is retained. A bounded accessibility adapter supplies missing current/disabled semantics and focus navigation; vendor files are unchanged.',
        ]}
      />
    );
  return null;
}

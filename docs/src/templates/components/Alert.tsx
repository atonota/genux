// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Alert';
export const description =
  'Persistent inline status beside the content it describes. Alert stays in the page flow until the condition changes or someone dismisses it.';

export default function Alert({ part }: TemplateProps) {
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
          'For a condition that applies to a section or form and should remain readable while people work.',
          'Use Toast for a brief result and Modal only when the task cannot continue without a decision.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Native Alert uses role=alert; insert it when the condition appears so it is announced once.',
          'Status is conveyed by text and icon as well as color.',
          'Keyboard focus uses one visible non-surrounding marker; surrounding focus rings are not used.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Alert is persistent and inline; it is not a floating message.',
          'Examples change local state only. They make no network request, save no data and register no GenUX capability.',
          'Readable text stays at least 14 CSS px. Radii, colors and motion come from shared GenUX tokens.',
          'Browser contracts for these feedback examples live in docs/browser/drawer-feedback.spec.ts.',
          'Native Ant Design 6.6.6 APIs are referenced here; browser, device and rendered accessibility acceptance remain separate from source and DOM checks.',
        ]}
      />
    );
  return null;
}

// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Notification';
export const description =
  'Richer, non-blocking feedback with a title, description and optional action, shown at the edge of the page without interrupting work.';

export default function Notification({ part }: TemplateProps) {
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
          'For a result that needs a title and explanation, or offers one optional follow-up action.',
          'Keep essential information on the page as well. Notifications close and can be missed.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Write a specific title. Actions inside a notification must also be reachable elsewhere because the entry can close.',
          'Close buttons have accessible names and keep shared minimum target sizes.',
          'Keyboard focus uses one visible non-surrounding marker; surrounding focus rings are not used.',
          'Reduced motion removes decorative movement; content and status update immediately.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Notification is rich and transient; use it for useful context that is not required to continue.',
          'Examples change local state only. They make no network request, save no data and register no GenUX capability.',
          'Readable text stays at least 14 CSS px. Radii, colors and motion come from shared GenUX tokens.',
          'Browser contracts for these feedback examples live in docs/browser/drawer-feedback.spec.ts.',
          'Native Ant Design 6.6.6 APIs are referenced here; browser, device and rendered accessibility acceptance remain separate from source and DOM checks.',
        ]}
      />
    );
  return null;
}

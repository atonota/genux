// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Toast';
export const description =
  'Brief, non-blocking confirmation of a completed local action. Toast is the GenUX name for the native Ant Design message.';

export default function Toast({ part }: TemplateProps) {
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
          'For a short result that needs no decision, such as a saved local preference.',
          'Use Alert for persistent context, Notification for richer content and Modal when work must stop for a decision.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Never make a toast the only place an important result appears.',
          'Do not place required actions in a toast; it closes automatically.',
          'Reduced motion removes decorative movement; content and status update immediately.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Native message places entries at top center. The right-aligned profiles are GenUX presentation on the same native API.',
          'Examples change local state only. They make no network request, save no data and register no GenUX capability.',
          'Readable text stays at least 14 CSS px. Radii, colors and motion come from shared GenUX tokens.',
          'Browser contracts for these feedback examples live in docs/browser/drawer-feedback.spec.ts.',
          'Native Ant Design 6.6.6 APIs are referenced here; browser, device and rendered accessibility acceptance remain separate from source and DOM checks.',
        ]}
      />
    );
  return null;
}

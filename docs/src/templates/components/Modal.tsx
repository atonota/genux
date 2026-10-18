// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Modal';
export const description =
  'A blocking dialog for a decision that must be made before work continues. Focus stays inside and returns to the trigger when it closes.';

export default function Modal({ part }: TemplateProps) {
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
          'For a confirmation or short task that must be completed or cancelled before the page can continue.',
          'Prefer Drawer for secondary editing and Popconfirm for a small contextual confirmation.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Title every dialog. Focus moves inside on open, stays inside while open and returns to the trigger on close.',
          'Escape and a visible Cancel action close the dialog; destructive confirmations name the consequence.',
          'Keyboard focus uses one visible non-surrounding marker; surrounding focus rings are not used.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Modal blocks the page; reserve it for decisions that cannot wait.',
          'Examples change local state only. They make no network request, save no data and register no GenUX capability.',
          'Readable text stays at least 14 CSS px. Radii, colors and motion come from shared GenUX tokens.',
          'Browser contracts for these feedback examples live in docs/browser/drawer-feedback.spec.ts.',
          'Native Ant Design 6.6.6 APIs are referenced here; browser, device and rendered accessibility acceptance remain separate from source and DOM checks.',
        ]}
      />
    );
  return null;
}

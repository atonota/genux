// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Popconfirm';
export const description =
  'A small contextual confirmation attached to the action it protects, without leaving the current place.';

export default function Popconfirm({ part }: TemplateProps) {
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
          'For a quick confirmation of a limited risk, such as removing one local item.',
          'Use Modal when the consequence needs explanation or several inputs.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'The trigger keeps its own accessible name. The popup is reachable by keyboard and Escape closes it.',
          'Name the consequence in the question and the confirm action, not with color alone.',
          'Keyboard focus uses one visible non-surrounding marker; surrounding focus rings are not used.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Popconfirm is contextual and lightweight; it does not replace server-side confirmation or authorization.',
          'Examples change local state only. They make no network request, save no data and register no GenUX capability.',
          'Readable text stays at least 14 CSS px. Radii, colors and motion come from shared GenUX tokens.',
          'Browser contracts for these feedback examples live in docs/browser/drawer-feedback.spec.ts.',
          'Native Ant Design 6.6.6 APIs are referenced here; browser, device and rendered accessibility acceptance remain separate from source and DOM checks.',
        ]}
      />
    );
  return null;
}

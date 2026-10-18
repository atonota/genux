// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Select';
export const description =
  'Supports single or multiple selection from a set of options. The control and popup share the same theme.';

export default function Select({ part }: TemplateProps) {
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
          'For predefined options that do not need to remain visible on screen.',
          'For searching long lists or selecting several values with multiple mode.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Provide an accessible name. Preserve arrow keys, Enter, Escape, Tab and clearing behavior.',
          'Explain why an option is disabled with help text when needed.',
          'Preserve selection and focus management when customizing popupRender. A native select appearance does not satisfy the project contract.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'The showSearch object and semantic popup slots follow the installed Ant Design 6.6.6 API.',
          'The theme also applies to the list rendered through a portal; styling only the closed control is insufficient.',
          'Only the filled surface is offered. Light and dark gray field fills are darker than their surroundings. Existing shadows and visible non-surrounding keyboard focus are preserved.',
        ]}
      />
    );
  return null;
}

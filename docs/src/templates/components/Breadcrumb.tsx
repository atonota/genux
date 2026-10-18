// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Breadcrumb';
export const description =
  'A readable path through the workspace. Move back through real links, jump to related pages and recognize your current location.';

export default function Breadcrumb({ part }: TemplateProps) {
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
          'To show the current page within a hierarchy and provide a reliable path back.',
          'Use sibling navigation when related pages are useful next steps. Keep the current page distinct from links.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Use Tab to reach links and sibling controls. Enter, Space or ArrowDown opens the menu; Escape returns focus.',
          'Arrow keys move through native menu items. Enter or Space activates the selected destination exactly once.',
          'The current page has aria-current=page. Icons and separators are decorative; icon-only home keeps its accessible name.',
          'Paths wrap at narrow widths without reducing text size. Links and menu targets retain shared minimum dimensions.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'The two variants share one native component and the existing GenUX tokens, sizing, language and motion contracts.',
          'The example path describes a workspace context; its links lead to actual documentation routes.',
        ]}
      />
    );
  return null;
}

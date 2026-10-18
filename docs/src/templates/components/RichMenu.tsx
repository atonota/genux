// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Rich menu';
export const description =
  'Grouped menu actions with a title and description each, built on GenUXDropdown so the native menu keeps its focus, keyboard and dismissal behavior.';

export default function RichMenu({ part }: TemplateProps) {
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
          'When a few related actions each need a sentence of explanation before people choose.',
          'Use a plain dropdown when the action titles alone are clear.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'The trigger is a button named by label, and group labels are announced with their actions.',
          'Each item name includes its title and description; icons are hidden from assistive technology.',
          'Arrow keys follow the flat DOM order of items, also when wide popups lay groups out in two columns.',
          'Unavailable actions stay visible and disabled, and Escape closes the menu.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'There is no second menu engine: grouping, focus and dismissal come from GenUXDropdown and Ant Design Dropdown.',
          'Narrow screens use one column with a maximum height and scrolling inside the popup.',
          'onAction only reports an id; the example updates local status text such as Selected: Draft report.',
        ]}
      />
    );
  return null;
}

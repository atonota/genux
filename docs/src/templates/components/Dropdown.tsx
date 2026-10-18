// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Dropdown';
export const description =
  'Keep secondary actions close and the next step clear. Explore a simple action menu, two surface treatments and an organized cascading menu.';

export default function Dropdown({ part }: TemplateProps) {
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
          'To keep related secondary actions beside their context without crowding the main flow.',
          'Use groups and one submenu when they make actions easier to find. Keep essential actions visible outside the menu.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Use Enter, Space or ArrowDown to open the menu. Arrow keys move through choices; Escape returns to the trigger.',
          'Submenus support click and keyboard Right/Left navigation. Disabled actions and branches cannot execute.',
          'Menu panels stay within the available viewport and scroll inside. Focus uses one visible edge marker.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'All examples have local outcomes. They do not sign out an account, publish data or call a server.',
          'The page separates action hierarchy from surface styling and nested organization. Shared tokens own text, target sizes and motion.',
        ]}
      />
    );
  return null;
}

// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Drawer';
export const description =
  'Opens secondary details or editing while preserving the main context. Opening, closing and focus return are controlled.';

export default function Drawer({ part }: TemplateProps) {
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
          'When a short detail or editing flow should preserve the main page context.',
          'Consider a separate page when content replaces the main task. Avoid forcing every detail into a drawer.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Title the panel, manage keyboard focus inside it and return focus to the trigger when it closes.',
          'Preserve Escape and a visible close action. Do not rely only on touching the mask to close.',
          'Verify access to content and footer actions at 320 CSS px, short landscape heights and with the virtual keyboard open.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'New Drawer placements, surfaces and form flows are experimental and are not recorded as final decisions.',
          'Use destroyOnHidden instead of deprecated destroyOnClose, the v6 focusable contract and semantic styles/classNames slots.',
          'Examples do not make network requests or persist data. Draft deletion on close must be an explicit behavior in a real product.',
        ]}
      />
    );
  return null;
}

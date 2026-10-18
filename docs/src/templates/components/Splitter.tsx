// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Splitter';
export const description =
  'Give related tasks their own space. Adaptive panels start stacked, expand side by side when space allows and retain selection, drafts and focus while resizing.';

export default function Splitter({ part }: TemplateProps) {
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
          'For a collection and inspector, an editor and review, or two related tasks that benefit from adjustable space.',
          'Start with a stacked flow on narrow screens. Keep each panel readable and provide a non-drag way to resize.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Focus the named separator with Tab. Use the axis-appropriate arrow keys to resize; Home and End move to the allowed limits.',
          'Visible panel buttons provide a single-pointer alternative to dragging. Focus uses one non-surrounding edge marker.',
          'Each pane is a named keyboard-scrollable region. Panel content and focus remain mounted while the layout changes.',
          'The grip reserves its own space; its hit area is at least 32px, increasing for coarse input without covering content.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Uses the installed native Ant Design Splitter and Panel without changing vendor source or approved component decisions.',
          'All five Data workspace pages share this adapter. Resizing changes presentation and never commits a record.',
          'Styles load only on Splitter and Data workspace routes. The mobile and desktop presentations share one mounted content tree.',
        ]}
      />
    );
  return null;
}

// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Cascader';
export const description =
  'Choose a destination through a clear hierarchy. Search complete paths, distinguish similar names and review multiple selections without losing context.';

export default function Cascader({ part }: TemplateProps) {
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
          'For a structured choice with several levels, such as a team and area, category or record group.',
          'Use searchable paths when people know part of the destination. Keep full-path context when leaf names repeat.',
          'Use Select for a flat list and AutoComplete for free text. Cascader commits a supplied hierarchical value.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'The visible label names the combobox. A tree popup exposes levels, expanded branches, selection, unavailable items and mixed checks, with real active-descendant IDs.',
          'Native Up/Down navigates choices, Right/Left moves between levels, Enter selects and Escape closes. IME composition never becomes an accidental selection.',
          'At narrow widths, columns scroll inside the popup and the active column is brought into view. Field and page stay inside the viewport; text and shared targets remain readable.',
          'Keyboard focus uses a single visible edge marker, never a surrounding ring. Reduced motion removes decorative transitions without delaying semantic updates.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Examples use local data. They do not search a backend, assign permissions or simulate network progress. Lazy reveal is deliberately separate from searchable data.',
          'The shared sm/md/lg profile supplies48/56/64px fields and32/40/50px check marks. Theme, language and presentation changes keep mounted values.',
          'Cascader master and catalog assets load only on this route. No Storybook approval or GenUX registry capability is implied by this documentation example.',
        ]}
      />
    );
  return null;
}

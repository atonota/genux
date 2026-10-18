// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Listy';
export const description =
  'Show related records as readable lists on shared GenUX rows. Sixteen live patterns cover plain, selectable, reorderable, grouped and virtual lists on one central surface with the shared compact sizes.';

export default function Listy({ part }: TemplateProps) {
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
          'For a list of related records that people scan, such as pages, people or recent work.',
          'Place single or multiple selection, switches and row actions as native controls inside the row; the list adds no keyboard model of its own.',
          'Use grouped sticky headers for long categorized data and a bounded virtual list for thousands of records.',
          'Use Table for aligned fields, Select for a choice and Cascader for a hierarchy. The Cascader popup reuses the same row.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'The list group is named by label. Rows are readable content and add no extra keyboard model.',
          'Selection, switches, row actions and reorder buttons are native controls reached with Tab; outcomes are announced in a polite status region. Keyboard focus uses one non-surrounding marker.',
          'Reordering never depends on dragging: Move up and Move down buttons outside the list move the selected row and keep focus on the button.',
          'Icons are decorative; labels and descriptions carry the meaning. Unavailable rows are stated in text.',
          'At 320 CSS px rows wrap naturally and the page does not scroll horizontally. Row text defaults to 14 CSS px in Outfit; a custom typography token can lower it only to the project minimum of 12 CSS px.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Uses the installed Ant Design 6.6.6 Listy; no package was added and vendor files are unchanged.',
          'GenUXListyItem is the shared row primitive. The Cascader popup composes the same row while keeping its native tree semantics.',
          'Compact rows follow the shared sm/md/lg profile at 32/40/48 px with the shared radius role; rows with descriptions or 48/56/64 px avatars grow instead of clipping.',
          'The Listy surface role in the Tweaker theme tokens switches every list between inset and outlined. The Cascader popup reads the same role.',
          'Sixteen live patterns: plain with key-value, unordered, ordered, icon, single select, multiple select, settings, row actions, reorder, steps, loading and empty status, rich content, nested, market, grouped and virtual.',
          'Examples use local data and local state only; there is no backend. Storybook, approved decisions and GenUX registries are unchanged.',
        ]}
      />
    );
  return null;
}

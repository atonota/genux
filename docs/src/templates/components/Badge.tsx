// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Badge';
export const description =
  'Short status, count and label markers on shared GenUX surfaces. Labels, counts, dots and ribbons keep fixed 20, 26 and 32 px heights.';

export default function Badge({ part }: TemplateProps) {
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
          'To show a short status, category or count beside the content it describes.',
          'Attach a count or dot to a button or avatar when new items need attention. Keep the full count available as text.',
          'Use Pill for selectable tags in a collection and Alert for messages that need an explanation.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Status meaning is carried by readable text such as Paid, Refunded or Failed, never by color alone.',
          'Counts and dots are named by label; overflowed counts keep the actual number in the accessible name. Live counters announce the full count politely.',
          'The remove action has a name, works with Enter or Space and keeps focus inside the example. Escape does not remove a label.',
          'Keyboard focus uses one non-surrounding marker. Text stays at least 14 CSS px in Outfit and wraps at 320 CSS px.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Labels, counts and dots paint fixed 20, 26 and 32 px outer heights. A dot reserves the same box around a smaller native dot.',
          'Text uses Outfit at weight 400. Corners follow the general radius role: 0, 3, 5 px or 100%, with 5 px by default.',
          'Colors come from the existing semantic palette. Motion uses the shared Cubic easing and respects reduced motion.',
          'Uses installed Ant Design Badge and Tag; no package was added. Examples use local state only; Storybook, approved decisions and GenUX registries are unchanged.',
        ]}
      />
    );
  return null;
}

// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Chart';
export const description =
  'A static grouped bar chart in SVG with value labels, patterned series, a visible legend and the complete numeric table.';

export default function Chart({ part }: TemplateProps) {
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
          'To compare a few series across a short list of categories on one scale.',
          'When the exact values must stay available as a table next to the picture.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'The figure is named by its title and described by description; drawn bars are hidden and the table carries the data.',
          'Series differ by pattern as well as color, each bar shows its value as text and the legend stays visible.',
          'The table has a caption, row and column headers and end-aligned tabular numbers.',
          'The plot and the table scroll inside their own focusable regions instead of widening the page.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'No chart library is used; bar geometry is plain arithmetic on one scale that starts at zero.',
          'Empty data, unnamed categories, duplicate series ids, unequal lengths and negative or non-finite values show Chart data unavailable with the reason in an alert.',
          'The chart is static: no animation, tooltips or interaction beyond scrolling.',
          'chartDataProblem is exported so callers can check data before rendering.',
        ]}
      />
    );
  return null;
}

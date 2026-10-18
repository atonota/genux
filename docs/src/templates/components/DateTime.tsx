// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Date and time';
export const description =
  'Choose a day, week, month, quarter, year or moment in time, alone or as a range, with presets and extra information in date cells.';

export default function DateTime({ part }: TemplateProps) {
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
          'For dates and times where a calendar or time list helps people choose a valid value.',
          'Use ranges for periods, presets for common choices and cell information only when it helps the decision.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Each picker has a visible label. Typed input, arrow keys, Enter and Escape remain available alongside the calendar.',
          'Explain unavailable dates and cell information in text, not only with color or marks.',
          'Keyboard focus uses one visible non-surrounding marker; surrounding focus rings are not used.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Values are Dayjs objects owned by the example. Time zones and server formats belong to the consuming application.',
          'Examples change local state only. They make no network request, save no data and register no GenUX capability.',
          'Readable text stays at least 14 CSS px. Radii, colors and motion come from shared GenUX tokens.',
          'Browser acceptance for date and time examples belongs to the docs/browser suites.',
          'Native Ant Design 6.6.6 APIs are referenced here; browser, device and rendered accessibility acceptance remain separate from source and DOM checks.',
        ]}
      />
    );
  return null;
}

// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Form';
export const description =
  'Manages labels, field values, validation and submission in one contract. Submission results in these examples stay local.';

export default function Form({ part }: TemplateProps) {
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
          'To validate related fields and submit them as one value model.',
          'To associate error descriptions, required fields and control labels consistently.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Preserve each field relationship with its label, error and help text. Do not explain requirements only through color or an asterisk.',
          'Make the first error discoverable when submission fails. Preserve valid values the user entered.',
          'Announce actual operation results through live status text. Manage repeat submissions and pending operations in application state.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Form layouts and new examples are experimental. Server validation, authorization and persistence are outside these technical examples.',
          'Use initialValues instead of field defaultValue inside a named Form.Item. Keep a single owner for each field value.',
          'Do not nest form elements. A Form inside Drawer must have an independent, explicit submission relationship.',
        ]}
      />
    );
  return null;
}

// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Record forms';
export const description =
  'Explore single-page, multistep, section, tab, accordion and header-line forms with one persistent draft and validation across hidden groups.';

export default function RecordForms({ part }: TemplateProps) {
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
          'For exploring form flow and field organization as independent choices.',
          'For validating repeated line items and revealing an invalid field in another step or closed group.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Mobile and desktop examples share record identity and preserve authored drafts.',
          'The controlled RecordForm on Record workspace provides the navigable error summary. This gallery reveals invalid hidden groups and focuses their fields.',
          'Controls support keyboard access with one visible non-surrounding focus indicator.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Controlled collection, form and display components are demonstrated together on the Record workspace page.',
          'Experimental web examples awaiting user approval. They are not added to Storybook or the approved decision model.',
          'The examples use twelve fictional records and local state. They do not implement a server, permissions, live AI, an ERP engine or persistence.',
          'The reference material supplies data arrangements and view types. The visual identity comes from existing GenUX components and semantic tokens.',
        ]}
      />
    );
  return null;
}

// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Data table';
export const description =
  'Explore readable tables, grouping, hierarchy and local row editing with stable records, explicit selection and shared GenUX controls.';

export default function DataTable({ part }: TemplateProps) {
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
          'For structured records whose fields need aligned headers, sorting and filtering.',
          'For grouped or hierarchical records and explicitly saved local row drafts.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Mobile and desktop examples share record identity and preserve authored drafts.',
          'Table columns retain readable minimum widths and scroll inside their own container.',
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

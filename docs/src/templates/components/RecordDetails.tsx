// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Record details';
export const description =
  'Inspect the same record through full-page, modal, drawer, sheet, inline and split presentations while retaining keyed local drafts.';

export default function RecordDetails({ part }: TemplateProps) {
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
          'For reading or editing one record without conflating its content with the presentation container.',
          'For comparing mobile and desktop detail access, related data and local record drafts.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Mobile and desktop examples share record identity and preserve authored drafts.',
          'Keep section navigation, related-record return context and long-content actions reachable in modal and non-modal containers.',
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

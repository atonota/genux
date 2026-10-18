// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Content patterns';
export const description =
  'An icon list, a quotation with a visible source and an avatar group that always shows the names of the people it represents.';

export default function ContentPatterns({ part }: TemplateProps) {
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
          'Use the icon list for short checklists or feature lists where each title carries the meaning.',
          'Use the quotation when a statement needs a visible source and, for examples, a disclosed context.',
          'Use the avatar group to show who is involved without hiding names behind overlapping photographs.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Icons and overlapping faces are hidden from assistive technology; visible titles and names carry the meaning.',
          'The quotation uses blockquote inside a figure, and the attribution is plain caption text.',
          'Expand people is a native button with aria-expanded and aria-controls; it reveals the whole list, so no action is clipped or hidden.',
          'The collapsed list states how many more people there are as text, not only as +N beside the faces.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'GenUXAvatarGroup composes the existing Ant Design Avatar and Button through GenUXAvatar and GenUXButton.',
          'Quotations in examples are fictional and labelled as such; they do not imply endorsement.',
          'All content is supplied by the caller; nothing is stored or fetched.',
        ]}
      />
    );
  return null;
}

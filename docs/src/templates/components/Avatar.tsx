// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Avatar';
export const description =
  'Help people recognize who is involved with a profile image or readable initials. A missing image keeps the same size and shape, and the name stays available as text.';

export default function Avatar({ part }: TemplateProps) {
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
          'Beside a name in lists, comments, assignments and record headers, to support quick recognition.',
          'Always pair the avatar with a meaningful name. Images and initials support recognition; they do not replace the name.',
          'Do not use avatar color alone to communicate status, role or availability.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Every avatar receives a meaningful person name. When it stands alone, that name is its accessible name. Beside a visible name, set decorative so the name is not announced twice.',
          'Initials and a failed image keep the same reserved size and shape, so the layout does not shift.',
          'Never use avatar color alone for status. State presence, role or availability in text.',
          'Initials and adjacent names stay at least 14 CSS px and readable in both themes.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Guidance paraphrases Refactoring UI on user-supplied images (pages 214-216): give them a fixed size and shape and a calm fallback. No book text or images are reproduced.',
          'GenUXAvatar styles load only on this route from genux-avatar.css. Each usage example imports that stylesheet explicitly; the component never imports it globally. Upload, cropping and profile services are outside this component.',
          'Examples use fictional names and a deliberately missing local image path. They call no backend, save no data and register no GenUX capability.',
          'Browser behavior checks for these examples are in docs/browser/refactoring-ui.spec.ts.',
          'This web experiment leaves Storybook and approved component decisions unchanged.',
          'Native Ant Design 6.6.6 APIs are referenced here; browser, device and rendered accessibility acceptance remain separate from source and DOM checks.',
        ]}
      />
    );
  return null;
}

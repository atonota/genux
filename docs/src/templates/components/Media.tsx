// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Media frame';
export const description =
  'A native figure reserves its ratio before the image loads, keeps a readable fallback when it fails and places the caption below the image.';

export default function Media({ part }: TemplateProps) {
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
          'For photographs and illustrations that need a caption or a short label over the image.',
          'When surrounding content must not move while an image loads or after it fails.',
          'For recorded screenshots whose text must stay readable at the original size.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'alt names the image. An empty alt makes the image and its fallback decorative and hidden from assistive technology.',
          'When the image is missing or fails, the frame shows Image unavailable and the alt text as visible text.',
          'After a failed load, Retry image is a native button outside any hidden fallback text, so it stays named and reachable even for decorative images.',
          'After a retry, a status reports Retrying image, then Image loaded or Image still unavailable.',
          'The caption is a native figcaption, and overlay text sits on an opaque panel so contrast does not depend on the photograph.',
          'The screenshot scroll region is focusable and named by its caption, so arrow and page keys scroll it; a bottom edge marks keyboard focus.',
          'When the screenshot cannot load, Screenshot unavailable and the text alternative are shown as visible text instead of an empty image.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'This is a native figure composition, not the Ant Design Image component, and it has no preview overlay.',
          'The frame reserves its ratio before loading, so a slow or failed image does not shift the page.',
          'Retry image requests the same src again by remounting the image; the address is not changed, no cache-busting query is added and nothing retries on a timer.',
          'data-image-state reports none, loading, loaded or error for styling and tests; it is not a visible status.',
          'Examples use local illustrations only; no image is fetched from a remote service.',
          'GenUXScreenshot never scales the image down: width and height reserve the original size, and the region scrolls instead of shrinking the text.',
          'The recorded screenshot is a static local file with no zoom, live controls or server capability.',
        ]}
      />
    );
  return null;
}

// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Pagination';
export const description =
  'Keep your place in a long collection. Move between pages, change the page size and jump directly to a known page with shared GenUX controls.';

export default function Pagination({ part }: TemplateProps) {
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
          'For a bounded collection whose total and current page are known.',
          'Keep pagination beside the collection it controls. Use the range and total to explain which records are visible.',
          'Choose from the existing Solid, Outline, Pastel-filled, Text button and Link surfaces to fit the action hierarchy.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Use Tab to reach page buttons, the size control and jump field. Activate buttons with Enter or Space.',
          'The selected page has aria-current=page. Named first, previous, next and last actions remain distinct.',
          'Keyboard focus uses the shared non-surrounding indicator. Disabled and boundary actions cannot change the page.',
          'Controls wrap within narrow containers while preserving readable text and the shared target sizes.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'The first two pages, last two pages and current page with its immediate neighbors remain visible; ellipses separate gaps.',
          'Pagination inherits the shared sm/md/lg component size profile. It has no separate size prop.',
          'The installed Ant Design 6.6.6 Pagination is an API reference. Explicit first and last actions belong to GenUXPagination; they are not native Pagination props.',
          'The example owns its page, page size and local review note. Presentation and language changes preserve that state.',
          'The current page keeps a separate single-edge marker across all five Button surfaces, including Text button and Link.',
        ]}
      />
    );
  return null;
}

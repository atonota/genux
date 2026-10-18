// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Record workspace';
export const description =
  'Create, list and inspect local records with controlled components, shared fields and explicit drafts across order and equipment schemas.';

export default function RecordWorkspace({ part }: TemplateProps) {
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
          'For composing a reusable listing, entry and single-record display with caller-owned data.',
          'For reviewing field semantics, validation, action scope and state recovery across two distinct schemas.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Use the mobile example at 320 CSS px; tables scroll within their own named keyboard region without shrinking text.',
          'Reveal and focus invalid fields through the error summary while preserving the single mounted field tree.',
          'Entity IDs, checked targets and return context stay stable when labels, layout or content organization change.',
          'Use one visible non-surrounding focus marker and preserve reduced-motion preferences.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Experimental reusable web components; Storybook and approved component decisions are unchanged.',
          'The connected fixture performs local commits only. Refreshing the page resets its record data; exported color settings have their own separate storage contract.',
          'Date-only fields, explicit UTC instants and paired date ranges preserve their meaning across edit, listing and display.',
          'Column pinning, resizing, range selection and clipboard grids are not part of this implementation. Specialized engines and external publishing require their own product scope.',
          'Browser, device, rendered accessibility and visual acceptance remain separate from source and DOM checks.',
        ]}
      />
    );
  return null;
}

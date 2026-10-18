// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Input';
export const description =
  'Combines single-line, multiline, password, search and numeric inputs under the same semantic theme.';

export default function Input({ part }: TemplateProps) {
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
          'Use Input for free text and Input.TextArea for longer descriptions.',
          'Use InputNumber for numbers, Input.Search for search and Input.Password for concealed text.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'A placeholder does not replace a label. Provide a visible label or an equivalent accessible name.',
          'Associate error text with the field and provide an explanation beyond color. Explain required fields in text.',
          'Use appropriate type, inputMode and autoComplete values for mobile keyboards. Preserve zoom and user font preferences.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'InputNumber is a separate component; its onChange value differs from the Input text event.',
          'NumberStepper places real GenUXIconButton actions alongside InputNumber, without interactive buttons inside native icon slots. A button click produces one step; typing and arrow keys retain native behavior. The application handles removal in onRemove.',
          'The project offers only the filled field surface. Normal surrounding borders are invisible; existing shadows, semantic error/warning borders and single-edge keyboard focus are preserved. This catalog records no new decisions.',
          'Light gray and dark gray field fills are darker than their page and panel backgrounds. Shared surface tokens are used; theme changes do not reset data through keys or conditional component trees.',
        ]}
      />
    );
  return null;
}

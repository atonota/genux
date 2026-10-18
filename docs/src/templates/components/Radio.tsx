// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Radio';
export const description =
  'Selects one related option. Circle and button presentations use the same group model.';

export default function Radio({ part }: TemplateProps) {
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
          'When a small set of options should remain visible and only one may be selected.',
          'Use a button-style group to show a clear choice between related modes.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Name the group and keep option labels visible. Use Checkbox for independent selections.',
          'Preserve arrow-key navigation and Space to select.',
          'Do not indicate selection with color alone. Button presentation must preserve radio semantics.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Native size belongs to Radio.Group, not to a single Radio.',
          'Web segmented selection uses AntD Segmented: one pill wrapper, a shared background and the native moving selection surface. It uses a symmetric 320 ms easeInOutCubic transition; reduced motion disables movement.',
          'Circle Radio uses 32/40/50 px diameters with a separate label hit area of at least 48 px. The selected label underline follows the radio color, theme and hover state. A separate single-edge indicator shows keyboard focus.',
          'Form.Item binds Radio.Group through the regular value field; valuePropName="checked" is unnecessary.',
        ]}
      />
    );
  return null;
}

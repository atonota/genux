// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Slider';
export const description =
  'Chooses a value or interval with radio-sized handles. Horizontal, range, numeric, vertical and reversed controls share one GenUX master.';

export default function Slider({ part }: TemplateProps) {
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
          'For a bounded numeric value or interval where the relative position helps the choice.',
          'Pair the slider with InputNumber when users need to enter an exact integer or decimal.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Name each range handle separately. Use value text to explain units instead of relying on color or tooltip visibility.',
          'Keep keyboard input enabled: arrow keys adjust values and Home/End reach the bounds. Reversed and vertical controls retain native direction behavior.',
          'Handles match the Radio visual size while reserving a separate stable interaction area. Keyboard focus uses one bottom marker without a surrounding ring.',
          'Numeric inputs offer an exact-entry alternative. Readable labels and values remain at least 14px at 320 CSS px.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'One GenUXSlider master is shared by this page and the color system. Its stylesheet loads only on routes that use it.',
          'Values and ARIA update immediately; presentation uses the central symmetric easing and honors reduced motion.',
          'This page uses Ant Design 6.6.6 public APIs. The legacy vertical prop remains supported; orientation is used in these examples.',
          'Storybook and previously approved component decisions are unchanged. Browser and physical-device acceptance remain separate from source and DOM checks.',
        ]}
      />
    );
  return null;
}

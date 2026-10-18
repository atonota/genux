// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Checkbox';
export const description = 'Manages independent yes/no values or multiple selections from a set.';

export default function Checkbox({ part }: TemplateProps) {
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
          'For preferences where several options may be checked at once.',
          'For consent and preference fields edited before submission.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Keep the text label inside the clickable area. Use fieldset/legend or an accessible group name.',
          'Preserve Space to toggle and Tab to navigate. The touch target is independent of the visible box.',
          'Do not indicate a partial state with color alone. Preserve native indeterminate semantics.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Checkbox has no native size prop. Shared project tokens manage the visible box and touch target.',
          'Shared sm/md/lg selection boxes are 32/40/50 px square. Label hit areas stay at least 48 px. Radii share the Button source: 0, 3, 5 px and pill.',
          'The web check mark is a local Phosphor SVG mask. Selection updates immediately; the decorative mark uses a symmetric 280 ms easeInOutCubic transition. Reduced motion disables the transition.',
          'Use valuePropName="checked" to bind checked inside Form.Item.',
        ]}
      />
    );
  return null;
}

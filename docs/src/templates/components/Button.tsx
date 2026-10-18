// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Button';
export const description =
  'Actions share three sizes, five surfaces and one Processing state. Wrapped double and triple choices, search and icon-only actions use the same GenUX controls.';

export default function Button({ part }: TemplateProps) {
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
          'For a clear action such as saving, continuing or opening a panel.',
          'To distinguish the primary action from secondary and destructive actions.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Use a name describing the action. Supply a separate accessible name for icon-only actions.',
          'Keep keyboard focus visible with a non-surrounding indicator. Surrounding rings and hiding focus without an alternative are prohibited.',
          'Do not communicate errors or success with color alone. Announce the result in the related live status text.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Buttons use sm/md/lg at 48/56/64 px and the existing 0, 3, 5 px and pill radii. Normal solid buttons have no surrounding border.',
          'GenUXIconButton composes the shared GenUXButton without a second visual renderer. Icon-only presentation is a web experiment; it adds no decisions to the existing Storybook gallery.',
          'Approved widths: Content, Wide and Full width. Narrow is experimental and is excluded from the decision gallery and selector.',
          'Preserves normal opacity 0.9, hover 1.0, Outfit (default weight 400, minimum 300), minimum 14px documentation text and natural 0 px letter spacing.',
          'The 4 px bottom layer, 2 px top layer when pressed, fixed body geometry and non-surrounding focus indicator are project CSS contracts rather than native Ant Design features.',
          'Processing is the only busy variant. Its thin progress line and Phosphor prohibited cursor show that repeated activation is blocked.',
          'Surfaces are solid, outline, pastel-filled, text and link, plus the Disabled state. The color families inherit the Color system with 10% white and 10% black; neutral identities are retained. Documentation press and release take 116.667 ms, 30% faster than the previous profile. Shared transient click waves use 400 ms Cubic motion and respect reduced motion.',
        ]}
      />
    );
  return null;
}

// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Pill';
export const description =
  'Filled by default, with solid and outlined surfaces. Status, icon, removable and selectable labels share one Pill system.';

export default function Pill({ part }: TemplateProps) {
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
          'To display selected tags or short pieces of information.',
          'For removable tags with a clear action name and sufficient click area.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Minimum 14px documentation text in Outfit (default weight 400, minimum 300); long text wraps naturally.',
          'The X mark is a Phosphor SVG; its close target is 32 px for precise input and 44 px for touch.',
          'Focus returns to the native input after removing a Select tag.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'GenUXPill uses native Ant Design Tag. GenUXCheckablePill uses fully controlled native CheckableTag; Select composes the same master.',
          'The filled palette retains 75% white and 5% black. Solid and outlined use the same 17 chromatic families, with contrast-selected ink. Neutral presets and the duplicate red endpoint are excluded.',
          'Automatic collections allocate after client commit, preserving identical SSR/hydration fallback. Theme, locale and size do not recreate the allocator. Explicit semantic colors and fixed palette assignments take precedence.',
          'Pill is a web experiment and requires user approval before entering the Storybook decision list.',
        ]}
      />
    );
  return null;
}

// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Accordion';
export const description =
  'Organizes content under expandable headings. Ant Design calls it Collapse; accordion is the single-open-panel mode.';

export default function Accordion({ part }: TemplateProps) {
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
          'To keep long content scannable by revealing secondary details when needed.',
          'Use accordion to show one topic at a time, or multiple open panels for content that needs comparison.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Write descriptive headings matching the content hierarchy. Preserve the trigger expanded relationship.',
          'Verify Enter/Space to toggle, Tab navigation and visible non-surrounding focus.',
          'Do not hide required errors or critical actions inside a closed panel users cannot find.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Accordion, surface, icon placement and density options remain experimental and are excluded from decisions.',
          'Use items instead of deprecated Collapse.Panel, and destroyOnHidden instead of destroyInactivePanel.',
          'Space support for Ant Design 6.6.6 Collapse headings is provided by toggleCollapseOnSpace in docs/src/react/keyboard.ts, scoped to those headings. Native Enter and inner control key behavior are preserved.',
          'Helper import paths in snippets target the verification files. Outside this project, copy keyboard.ts and adjust its import path for your component.',
          'Assess potential data loss before changing default content preservation in panels containing forms.',
        ]}
      />
    );
  return null;
}

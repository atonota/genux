// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Card';
export const description =
  'Purpose-built cards for records, metrics and actions. Explore 23 card purposes, domain recipes and controlled interactions before opening the optional GenUX lab.';

export default function Card({ part }: TemplateProps) {
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
          'Use EntityCard for a recognizable record and MetricCard for a value with its period and comparison.',
          'Choose a clear purpose and useful content. A task workspace may combine a table, form, chart and related actions; arrange peer cards as siblings.',
          'Use serializable card definitions for trusted rendering and validated GenUX intents; keep data access, queries and mutation in the Frappe host.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Keep one subject and a real heading per card. Peer cards are siblings, never nested visual cards.',
          'Use named primary actions, native selection controls and a non-drag alternative for moving tasks.',
          'At 320 CSS px, preserve readable content, source context and shared button targets; scroll only bounded collection surfaces.',
          'Preserve controlled values, selection and open local details through size, theme and locale changes.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'The purpose catalog covers 23 card purposes and at least 31 domain recipes, one selected preview at a time.',
          'Entity and Metric are the foundation. The page then groups domain recipes, interactions, states and the optional GenUX lab.',
          'No initial Card page import requires X Cards or X SDK. Open the lab explicitly to request its additional resources.',
          'Every example action changes local host state only. Metadata and supplied capability reasons do not prove server authorization.',
          'Card is a web experiment; this delivery does not promote approved decisions or Storybook stories.',
        ]}
      />
    );
  return null;
}

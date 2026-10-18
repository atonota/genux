// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Empty State';
export const description =
  'Explain why a collection shows nothing and offer the next useful step. First use, no matching results and unavailable records each have their own message and action.';

export default function EmptyState({ part }: TemplateProps) {
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
          'When a collection has no records yet. Treat the first view as an invitation to start, not as a blank area.',
          'When a search or filter returns nothing. Say so and offer a way to change or clear the search.',
          'When supplied records cannot be shown. Explain the problem and offer recovery. Loading and denied access are different states with their own messages.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Use a real heading and readable text. Illustrations are decorative and never the only explanation.',
          'Name the action by its outcome, such as Create first record or Clear search. Keyboard focus uses one non-surrounding marker.',
          'Announce results such as a created record or restored list in nearby status text. Keep the search field and its value when nothing matches.',
          'Distinguish first use, no match and error in text, not by color alone. Error text explains how to recover.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Guidance paraphrases Refactoring UI on empty states (pages 234-236): treat the first view as an invitation to act and lead with one clear action. No book text or images are reproduced.',
          'Loading uses a progress indicator and denied access uses a permission message. Neither is an empty state.',
          'Uses existing shared component styles and tokens. No decorative card or border is added, and readable text stays at least 14 CSS px in Outfit.',
          'Examples change local state only. They make no network request, save no data and register no GenUX capability.',
          'Browser behavior checks for these examples are in docs/browser/refactoring-ui.spec.ts.',
          'This web experiment leaves Storybook and approved component decisions unchanged.',
          'Native Ant Design 6.6.6 APIs are referenced here; browser, device and rendered accessibility acceptance remain separate from source and DOM checks.',
        ]}
      />
    );
  return null;
}

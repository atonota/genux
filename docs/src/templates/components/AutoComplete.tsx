// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'AutoComplete';
export const description =
  'Offer useful completions while keeping people in control of their text. Groups, descriptions and a context preview make the right suggestion easier to recognize.';

export default function AutoComplete({ part }: TemplateProps) {
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
          'For editable text with recognizable suggestions, such as a team name, documentation term or repeated address suffix.',
          'Use Select when a value must come from a fixed list. AutoComplete keeps a custom value even when no suggestion matches.',
          'Group related suggestions and explain similar choices. Keep metadata meaningful; do not invent popularity, counts or live availability.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'The visible label names the editable combobox. Guidance, result feedback and error messages remain associated with the same mounted input.',
          'Native arrow keys move through available suggestions, Enter chooses one and Escape dismisses the popup. IME composition never becomes an accidental suggestion selection.',
          'No match and unavailable suggestions keep custom text usable. Counts and status feedback are announced; disabled suggestions cannot be chosen.',
          'Narrow popups wrap descriptions and keep readable text and shared control targets. Keyboard focus uses one non-surrounding marker, with no surrounding ring.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'This page uses local entries and explicit sample availability states. It does not search a backend, verify an email address, create a team or pretend that a request is running.',
          'Use onChange for the controlled value rather than onSearch. Native suggestion selection and text composition are different events; entered text must stay immediate.',
          'The shared sm/md/lg profile supplies 48/56/64px controls. Settings stay in the initially closed Tweaker; size, detail, theme and language changes preserve drafts and selected context.',
          'Only this documentation route loads the AutoComplete master and catalog styles. Storybook, approved decisions and GenUX capability registries are unchanged.',
        ]}
      />
    );
  return null;
}

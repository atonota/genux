// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Carousel';
export const description =
  'A manual slide viewer with Previous slide and Next slide buttons, a visible position status and no autoplay.';

export default function Carousel({ part }: TemplateProps) {
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
          'For a small set of related images that people step through in order.',
          'Prefer a visible list or grid when people need to compare items side by side.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'The section is named by label and announced as a carousel; the active slide is a group named Slide {current} of {total}.',
          'A status message repeats the position after each move, and both buttons point to the slide with aria-controls.',
          'Navigation wraps at the ends, so a pressed button never disables itself and focus stays in place.',
          'Nothing moves on its own, so there is no pause control to find.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'This is not the Ant Design Carousel: there is no autoplay, timer, swipe gesture or slide transition.',
          'With one slide both buttons are disabled; with none the section shows No slides available.',
          'If the caller shortens the list, the shown slide stays within the new range.',
        ]}
      />
    );
  return null;
}

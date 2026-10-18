// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'FAB';
export const description =
  'Floating action button for the primary action of a screen, with speed dial, menu, arc and sheet layouts. GenUXFab is a GenUX wrapper composed from Button, Badge and Modal with its own API; it does not expose the native FloatButton API.';

export default function Fab({ part }: TemplateProps) {
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
          'For the single most important action on a screen, or a short set of closely related actions.',
          'Use a speed dial or menu for up to a handful of actions; longer lists belong in a menu or sheet layout.',
          'Do not hide navigation or destructive-only flows inside a FAB; use regular buttons for those.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'The trigger and every action are named by label in every content mode; readable text uses the central Outfit typography roles with a 14 CSS px minimum.',
          'The trigger exposes aria-expanded while it owns actions. Escape and selection return focus to the trigger; modal keeps focus inside until close.',
          'Menu types follow the APG menu button pattern: arrow keys move between actions, Enter and Space activate them.',
          'Hover, long press and gesture triggers always keep click, Enter and Space as alternatives; TV and remote input relies on focus, never hover.',
          'Draggable triggers must remain movable without a pointer; controlled dragPosition lets pages offer explicit keyboard controls.',
          'Hidden and permission-denied actions are filtered out; retained disabled, loading and offline-unavailable actions stay discoverable and announce disabledReason; loading is announced through genux-fab-status.',
          'Focus uses the shared ringless indicator; reduced motion removes movement without delaying state changes.',
          'No physical device certification is claimed; verification is by browser emulation and inline previews.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Every approved P0, P1 and P2 axis is declared: all types, layouts, directions, shapes, appearances, content, label, icon, trigger, positioning, motion, backdrop, visibility, adaptation, close rules, groups, drag, obstacles and the full action model.',
          'Previews render inline in the four device mockups (phone, tablet, computer and TV); no iframe is used.',
          'GenUXFab is a custom API composed from Button, Badge and Modal; FloatButton is referenced as the official source, not wrapped one to one.',
          'permission is a caller-local UI flag. It is not server authorization; ownership and access checks belong to the application backend.',
          'No backend or AI service is involved; examples use local React state only.',
          'Easing and backdrop values are all declared, but only Cubic easing and the none and dim-blur backdrops are current. The remaining easing and backdrop choices stay disabled as pending until the human decision.',
          'The contextual type renders only when the caller passes visible true with at least one eligible action; the gallery passes visible true for its contextual demonstration.',
          'The existing frozen palette and motion baseline are unchanged.',
        ]}
      />
    );
  return null;
}

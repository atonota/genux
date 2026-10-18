// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Switch';
export const description = 'Represents an on/off setting with a clear effect.';

export default function Switch({ part }: TemplateProps) {
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
          'When the setting state and the effect of changing it are clear to the user.',
          'Checkbox may be more appropriate for independent consent submitted at the end of a form.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'Keep the setting name unchanged in both states. Describe the state separately.',
          'Preserve keyboard and touch behavior. A smaller presentation must not reduce the interaction area.',
          'If an update fails, restore the previous value and show an error according to the actual operation result.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'Use valuePropName="checked" inside Form.Item.',
          'Combine checked and disabled for a required-on setting. Users cannot turn it off with mouse, touch or keyboard. The visible label explains the requirement.',
          'Use medium in new examples because the native default size name is deprecated.',
          'Shared sm/md/lg Switch tracks are 32/40/50 px high and twice as wide. The thumb is 80% of the track height with a 10% inset at each end. Content variants reserve extra width without reducing text size.',
          'On and off hover states use opacity and the shared shadow. Track and handle use symmetric 320 ms easeInOutCubic transitions; reduced motion disables them.',
        ]}
      />
    );
  return null;
}

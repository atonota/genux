// Page-specific documentation composition. Product adapters, API and live demos stay shared.
import { DocumentationList, type TemplateProps } from '../content';

export const title = 'Upload';
export const description =
  'Local file selection on Upload.Dragger: chosen files are checked, listed with name and size and can be removed. Nothing is sent to a server.';

export default function Upload({ part }: TemplateProps) {
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
          'When people choose or drop files that the page reads or passes to its own later step.',
          'When type and size limits must be explained before and after a choice.',
        ]}
      />
    );
  if (part === 'accessibility')
    return (
      <DocumentationList
        items={[
          'The drop area is a button named by label; Enter and Space open the native file chooser.',
          'Helper text states that files stay on this device and lists the accepted types and size limit.',
          'Refused files are reported by name with the reason, file type or size, in a role alert region.',
          'Each remove button is named Remove {name}, and focus returns to the choose control after removal.',
        ]}
      />
    );
  if (part === 'notes')
    return (
      <DocumentationList
        items={[
          'There is no action, customRequest or progress: files never leave the device and are never shown as uploaded.',
          'The accept value is only a hint for the native chooser; every chosen or dropped file is checked again.',
          'The list lives in memory only; reloading the page clears it and nothing is written to storage.',
          'parseAccept, isValidMaxBytes and uploadRejection are exported for callers that need the same rules.',
        ]}
      />
    );
  return null;
}

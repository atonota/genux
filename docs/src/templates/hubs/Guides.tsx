import type { HubProps } from '../content';

export const title = 'Guides';
export const description = 'Set up GenUX and understand validated, registered AI interfaces.';

export default function Guides({ part, children }: HubProps) {
  if (part === 'introduction')
    return (
      <>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </>
    );
  return (
    <>
      <h2 id="directory-title">Explore guides</h2>
      {children}
    </>
  );
}

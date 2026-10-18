import type { HubProps } from '../content';

export const title = 'Tools';
export const description = 'Explore palettes and configure themes using shared design tokens.';

export default function Tools({ part, children }: HubProps) {
  if (part === 'introduction')
    return (
      <>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </>
    );
  return (
    <>
      <h2 id="directory-title">Explore tools</h2>
      {children}
    </>
  );
}

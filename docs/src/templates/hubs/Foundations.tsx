import type { HubProps } from '../content';

export const title = 'Foundations';
export const description = 'Shared design tokens, interaction standards and adaptive behavior.';

export default function Foundations({ part, children }: HubProps) {
  if (part === 'introduction')
    return (
      <>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </>
    );
  return (
    <>
      <h2 id="directory-title">Explore foundations</h2>
      {children}
    </>
  );
}

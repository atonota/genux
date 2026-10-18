import type { HubProps } from '../content';

export const title = 'Project';
export const description = 'Project decisions, documentation contracts and URL policy.';

export default function Project({ part, children }: HubProps) {
  if (part === 'introduction')
    return (
      <>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </>
    );
  return (
    <>
      <h2 id="directory-title">Explore project</h2>
      {children}
    </>
  );
}

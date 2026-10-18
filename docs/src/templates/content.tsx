import type { ReactNode } from 'react';

export interface TemplateProps {
  part: 'introduction' | 'usage' | 'accessibility' | 'notes';
}
export interface HubProps {
  part: 'introduction' | 'directory';
  children?: ReactNode;
}

/** The shared list preserves semantic SSR/i18n; each page owns the literal prose and composition. */
export function DocumentationList({ items }: { items: readonly string[] }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item} data-i18n={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}

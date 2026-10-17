// Visible order of the component catalog, shared by the sidebar, the catalog page and the
// previous/next continuation: categories in first-appearance order, members in catalog array
// order. Pure data derived from the catalog; it imports no view and no route.
import { components, type ComponentDoc } from './catalog';

export interface CatalogGroup {
  /** Category label as the sidebar and the catalog page render it. */
  label: string;
  /** Catalog page section id (`category-<label>`), also the target of its Contents link. */
  id: string;
  components: readonly ComponentDoc[];
}

const sectionId = (label: string) =>
  'category-' +
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Category groups in the order the navigation renders them. */
export const catalogGroups: readonly CatalogGroup[] = [
  ...new Set(components.map(component => component.category)),
].map(label => ({
  label,
  id: sectionId(label),
  components: components.filter(component => component.category === label),
}));

/** Every component in visible order, so the continuation agrees with the navigation. */
export const catalogOrder: readonly ComponentDoc[] = catalogGroups.flatMap(
  group => group.components,
);

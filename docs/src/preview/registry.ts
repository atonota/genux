/** Allowlist of the 41 documentation demos the isolated preview document renders. Island module,
    export and route stylesheets come from the shared component route contract; this file only
    adds the literal loaders. Loaders stay dynamic, so a browser loads only the selected demo.
    Unknown ids fail the build. */
import type { ComponentType } from 'react';
import { componentRoutes } from '../data/component-routes';

export type PreviewDemoProps = { documentation?: boolean };
type DemoModule = Record<string, unknown>;
export type PreviewEntry = {
  readonly source: string;
  readonly exportName: string;
  readonly styles: readonly string[];
  readonly load: () => Promise<DemoModule>;
};

const loaders: Readonly<Record<string, () => Promise<DemoModule>>> = {
  button: () => import('../react/ButtonDemo'),
  input: () => import('../react/InputDemo'),
  select: () => import('../react/SelectDemo'),
  pill: () => import('../react/PillDemo'),
  card: () => import('../react/CardDemo'),
  splitter: () => import('../react/SplitterDemo'),
  breadcrumb: () => import('../react/BreadcrumbDemo'),
  pagination: () => import('../react/PaginationDemo'),
  steps: () => import('../react/StepsDemo'),
  autocomplete: () => import('../react/AutoCompleteDemo'),
  cascader: () => import('../react/CascaderDemo'),
  dropdown: () => import('../react/DropdownDemo'),
  checkbox: () => import('../react/CheckboxDemo'),
  radio: () => import('../react/RadioDemo'),
  switch: () => import('../react/SwitchDemo'),
  slider: () => import('../react/SliderDemo'),
  accordion: () => import('../react/AccordionDemo'),
  form: () => import('../react/FormDemo'),
  drawer: () => import('../react/DrawerDemo'),
  'empty-state': () => import('../react/EmptyStateDemo'),
  avatar: () => import('../react/AvatarDemo'),
  toast: () => import('../react/FeedbackDemo'),
  alert: () => import('../react/FeedbackDemo'),
  notification: () => import('../react/FeedbackDemo'),
  modal: () => import('../react/FeedbackDemo'),
  popconfirm: () => import('../react/FeedbackDemo'),
  'date-time': () => import('../react/DateTimeDemo'),
  'data-table': () => import('../react/workspace/CollectionDemo'),
  'collection-views': () => import('../react/workspace/CollectionDemo'),
  'record-details': () => import('../react/workspace/RecordDetailsDemo'),
  'record-forms': () => import('../react/workspace/RecordFormsDemo'),
  'record-workspace': () => import('../react/workspace/kit/ConnectedWorkspace'),
  media: () => import('../react/MediaDemo'),
  'content-patterns': () => import('../react/ContentPatternsDemo'),
  carousel: () => import('../react/CarouselDemo'),
  upload: () => import('../react/UploadDemo'),
  'rich-menu': () => import('../react/RichMenuDemo'),
  chart: () => import('../react/ChartDemo'),
  listy: () => import('../react/ListyDemo'),
  badge: () => import('../react/BadgeDemo'),
  fab: () => import('../react/FabDemo'),
};

export const previewRegistry: Readonly<Record<string, PreviewEntry>> = Object.fromEntries(
  Object.entries(loaders).map(([slug, load]) => {
    const route = componentRoutes[slug];
    if (!route) throw new Error(`Preview demo '${slug}' has no component route.`);
    const { module, exportName, stylesheets } = route;
    return [
      slug,
      { source: `docs/src/react/${module}.tsx`, exportName, styles: stylesheets, load },
    ];
  }),
);

// Delivery metadata and its usage helper live in the pure delivery-contract module, so the Code
// view can use them without loading this allowlist; re-exported here for existing importers.
export {
  previewEntrySources,
  previewDeliveryPropNames,
  previewDeliveryContracts,
  previewDeliveryUsage,
} from './delivery-contract';
export type { PreviewDeliveryValues, PreviewDeliveryContract } from './delivery-contract';

/** Longest registered component slug that prefixes a literal example id. */
export function previewSlugForId(id: string): string {
  const slug = Object.keys(previewRegistry)
    .filter(candidate => id === candidate || id.startsWith(`${candidate}-`))
    .sort((a, b) => b.length - a.length)[0];
  if (!slug) throw new Error(`Preview id '${id}' matches no registered component route.`);
  return slug;
}

export async function resolvePreviewDemo(
  entry: PreviewEntry,
): Promise<ComponentType<PreviewDemoProps>> {
  const demo = (await entry.load())[entry.exportName];
  if (typeof demo !== 'function' && (typeof demo !== 'object' || demo === null))
    throw new TypeError(`${entry.source} has no ${entry.exportName} export.`);
  return demo as ComponentType<PreviewDemoProps>;
}

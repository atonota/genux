/** Component route contract shared by the documentation component route and the isolated preview
    registry: which React island renders each catalog slug and which component stylesheets the
    route loads, in cascade order. Pure data with no imports, so client delivery bundles can
    include it. */

export interface ComponentRoute {
  /** Island module path relative to docs/src/react, without extension. */
  readonly module: string;
  /** Island export rendered for the route; 'default' for a default export. */
  readonly exportName: string;
  /** Component-specific stylesheets in docs/src/styles, in cascade order. */
  readonly stylesheets: readonly string[];
}

// Stylesheet names are space-separated without '.css'. Routes of one component family share its
// sheets: Data workspace routes add the splitter, kit routes the workspace kit, and feedback
// routes the card surface.
const route = (module: string, exportName = 'default', stylesheets = ''): ComponentRoute => ({
  module,
  exportName,
  stylesheets: stylesheets ? stylesheets.split(' ').map(name => `${name}.css`) : [],
});

const dataEntry = 'data-entry-catalog';
const selection = `${dataEntry} genux-selection-variants`;
const feedback = 'genux-card genux-feedback';
const workspace = 'genux-card genux-splitter';
const kit = 'workspace-kit kit-forms-fixes';
const collections = `${workspace} genux-avatar workspace workspace-collections ${kit} kit-identity`;

export const componentRoutes: Readonly<Record<string, ComponentRoute>> = {
  button: route('ButtonDemo', 'WebButtonDemo', 'button-catalog'),
  input: route('InputDemo', 'WebInputDemo', dataEntry),
  select: route('SelectDemo', 'WebSelectDemo', dataEntry),
  pill: route('PillDemo', 'default', 'pill-catalog'),
  card: route('CardDemo', 'default', 'genux-card card-catalog'),
  splitter: route('SplitterDemo', 'default', 'genux-splitter splitter-catalog'),
  breadcrumb: route('BreadcrumbDemo', 'default', 'genux-breadcrumb breadcrumb-catalog'),
  pagination: route('PaginationDemo', 'default', 'genux-pagination pagination-catalog'),
  steps: route('StepsDemo', 'default', 'genux-steps steps-catalog'),
  autocomplete: route('AutoCompleteDemo', 'default', 'genux-autocomplete autocomplete-catalog'),
  cascader: route('CascaderDemo', 'default', 'genux-cascader genux-listy cascader-catalog'),
  dropdown: route('DropdownDemo', 'default', 'genux-dropdown dropdown-catalog'),
  checkbox: route('CheckboxDemo', 'WebCheckboxDemo', selection),
  radio: route('RadioDemo', 'WebRadioDemo', selection),
  switch: route('SwitchDemo', 'WebSwitchDemo', selection),
  slider: route('SliderDemo', 'default', `slider ${dataEntry}`),
  accordion: route('AccordionDemo'),
  form: route('FormDemo', 'default', dataEntry),
  drawer: route('DrawerDemo', 'default', 'genux-drawer-extensions'),
  'empty-state': route('EmptyStateDemo', 'default', 'genux-pagination kit-collections'),
  avatar: route('AvatarDemo', 'default', 'genux-avatar'),
  toast: route('FeedbackDemo', 'ToastDemo', feedback),
  alert: route('FeedbackDemo', 'AlertDemo', feedback),
  notification: route('FeedbackDemo', 'NotificationDemo', feedback),
  modal: route('FeedbackDemo', 'ModalDemo', feedback),
  popconfirm: route('FeedbackDemo', 'PopconfirmDemo', feedback),
  'date-time': route('DateTimeDemo', 'default', `${dataEntry} genux-date-time`),
  'data-table': route('workspace/CollectionDemo', 'DataTableDemo', collections),
  'collection-views': route('workspace/CollectionDemo', 'default', collections),
  'record-details': route(
    'workspace/RecordDetailsDemo',
    'default',
    `${workspace} workspace workspace-details ${kit}`,
  ),
  'record-forms': route(
    'workspace/RecordFormsDemo',
    'default',
    `${workspace} workspace workspace-forms ${kit}`,
  ),
  'record-workspace': route(
    'workspace/kit/ConnectedWorkspace',
    'default',
    `slider ${workspace} genux-pagination genux-avatar ${kit} workspace workspace-connected kit-collections kit-records kit-identity`,
  ),
  media: route('MediaDemo', 'default', 'genux-media genux-screenshot'),
  'content-patterns': route(
    'ContentPatternsDemo',
    'default',
    'genux-avatar genux-content-patterns',
  ),
  carousel: route('CarouselDemo', 'default', 'genux-media genux-carousel'),
  upload: route('UploadDemo', 'default', 'genux-upload'),
  'rich-menu': route('RichMenuDemo', 'default', 'genux-dropdown genux-rich-menu'),
  chart: route('ChartDemo', 'default', 'genux-chart'),
  listy: route('ListyDemo', 'default', 'genux-listy genux-selection-variants genux-avatar'),
  badge: route('BadgeDemo', 'default', 'genux-avatar genux-badge'),
  fab: route('FabDemo', 'default', 'genux-badge genux-fab'),
};

/** Name the island is imported under: the export, or the module's file name for a default. */
export const islandBinding = ({ module, exportName }: ComponentRoute): string =>
  exportName === 'default' ? (module.split('/').at(-1) ?? module) : exportName;

/** Every documentation component route frames its inline previews with these sheets first. */
export const sharedRouteStylesheets = ['preview-document.css', 'preview-workbench.css'] as const;

/** Component-specific stylesheets of one route in cascade order. */
export function componentStylesheets(slug: string): readonly string[] {
  const entry = componentRoutes[slug];
  if (!entry) throw new Error(`Component route '${slug}' is not registered.`);
  return entry.stylesheets;
}

/** All stylesheets of one documentation component route: shared preview sheets first. */
export function routeStylesheets(slug: string): readonly string[] {
  return [...sharedRouteStylesheets, ...componentStylesheets(slug)];
}

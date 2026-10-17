// Page model of one documentation component route: the published source and test resources, the
// generated Astro example, the tab grouping and catalog neighbours. Pure server-side data; the
// route keeps the literal demo and stylesheet imports and the markup.
import packageManifest from '../../../package.json';
import documentationRules from './documentation-rules.json';
import type { ComponentDoc } from './catalog';
import { catalogOrder } from './component-navigation';
import { componentRoutes, islandBinding } from './component-routes';
import type { GenUXComponentName } from '../genux/contracts';

// Source locations published in each page's resources. Paths are relative to
// docs/src/react, docs/src/styles, docs/tests, docs/browser and docs/src/data.
// A route without an entry fails the documentation build gate until its adapter,
// styles and tests are named.
export interface ComponentSources {
  adapters?: readonly string[];
  styles: readonly string[];
  tests: readonly string[];
  browserTests?: readonly string[];
  /** Test helpers and guards, relative to the repository root; published as-is. */
  supportFiles?: readonly string[];
  catalogFiles?: readonly string[];
  /** Framework-free model sources, relative to docs/src. */
  modelFiles?: readonly string[];
  capabilities?: readonly GenUXComponentName[];
}
const uxCompletionTests = ['ux-completion.spec.ts'];
const uxPatternCatalog = ['catalog-ux-patterns.ts'];
const dataEntry = ['web.css', 'data-entry-catalog.css'];
const feedbackSources = ['components.css', 'genux-feedback.css', 'genux-card.css'];
export const componentSources: Readonly<Record<string, ComponentSources>> = {
  button: {
    adapters: ['GenUXButton.tsx'],
    styles: ['button-catalog.css'],
    tests: ['button-refresh'],
  },
  input: {
    adapters: ['NumberStepper.tsx', 'DataEntryCatalog.tsx'],
    styles: dataEntry,
    tests: ['patterns', 'data-entry-catalog'],
  },
  select: {
    adapters: ['GenUXPill.tsx', 'DataEntryCatalog.tsx'],
    styles: dataEntry,
    tests: ['patterns', 'data-entry-catalog'],
  },
  pill: {
    adapters: ['GenUXPill.tsx'],
    styles: ['pill-catalog.css'],
    tests: ['pill-refresh', 'pill-colors'],
  },
  card: {
    adapters: ['cards/GenUXCard.tsx'],
    styles: ['genux-card.css', 'card-catalog.css', 'genux-card-lab.css', 'genux-runtime.css'],
    tests: ['card', 'card-primitives'],
    capabilities: ['GenUXEntityCard', 'GenUXMetricCard', 'GenUXPurposeCard'],
  },
  splitter: {
    adapters: ['GenUXSplitter.tsx'],
    styles: ['genux-splitter.css', 'splitter-catalog.css'],
    tests: ['splitter', 'splitter-page'],
  },
  breadcrumb: {
    adapters: ['GenUXBreadcrumb.tsx'],
    styles: ['genux-breadcrumb.css', 'breadcrumb-catalog.css'],
    tests: ['breadcrumb'],
  },
  pagination: {
    adapters: ['GenUXPagination.tsx'],
    styles: ['genux-pagination.css', 'pagination-catalog.css'],
    tests: ['pagination', 'pagination-page'],
  },
  steps: {
    adapters: ['GenUXSteps.tsx'],
    styles: ['genux-steps.css', 'steps-catalog.css'],
    tests: ['steps', 'steps-page'],
  },
  autocomplete: {
    adapters: ['GenUXAutoComplete.tsx'],
    styles: ['genux-autocomplete.css', 'autocomplete-catalog.css'],
    tests: ['autocomplete', 'autocomplete-page'],
  },
  cascader: {
    adapters: ['GenUXCascader.tsx'],
    styles: ['genux-cascader.css', 'cascader-catalog.css'],
    tests: ['cascader', 'cascader-page'],
  },
  dropdown: {
    adapters: ['GenUXDropdown.tsx'],
    styles: ['genux-dropdown.css', 'dropdown-catalog.css'],
    tests: ['dropdown-page'],
  },
  checkbox: {
    adapters: ['DataEntryCatalog.tsx', 'GenUXSelectionVariants.tsx'],
    styles: [...dataEntry, 'genux-selection-variants.css'],
    tests: ['patterns', 'selection-size'],
  },
  radio: {
    adapters: ['GenUXSegmented.tsx', 'DataEntryCatalog.tsx', 'GenUXSelectionVariants.tsx'],
    styles: [...dataEntry, 'genux-selection-variants.css'],
    tests: ['patterns', 'selection-size'],
  },
  switch: {
    adapters: ['DataEntryCatalog.tsx', 'GenUXSelectionVariants.tsx'],
    styles: [...dataEntry, 'genux-selection-variants.css'],
    tests: ['patterns', 'selection-size'],
  },
  slider: {
    adapters: ['GenUXSlider.tsx', 'DataEntryCatalog.tsx'],
    styles: ['slider.css', 'data-entry-catalog.css'],
    tests: ['slider'],
  },
  accordion: {
    adapters: ['AccordionExamples.tsx'],
    styles: ['components.css'],
    tests: ['patterns'],
  },
  form: {
    adapters: ['FormExamples.tsx', 'DataEntryCatalog.tsx'],
    styles: dataEntry,
    tests: ['patterns', 'data-entry-catalog'],
  },
  drawer: {
    adapters: ['DrawerExamples.tsx', 'GenUXOverlay.tsx'],
    styles: ['components.css', 'genux-drawer-extensions.css'],
    tests: ['patterns'],
  },
  'empty-state': {
    adapters: ['GenUXEmptyState.tsx'],
    styles: ['components.css', 'genux-pagination.css', 'kit-collections.css'],
    tests: [],
    browserTests: ['refactoring-ui.spec.ts'],
    catalogFiles: ['catalog-content.ts'],
  },
  avatar: {
    adapters: ['GenUXAvatar.tsx'],
    styles: ['genux-avatar.css'],
    tests: [],
    browserTests: ['refactoring-ui.spec.ts'],
    catalogFiles: ['catalog-content.ts'],
  },
  toast: {
    adapters: ['GenUXFeedback.tsx'],
    styles: feedbackSources,
    tests: ['patterns'],
  },
  alert: {
    adapters: ['GenUXFeedback.tsx'],
    styles: feedbackSources,
    tests: ['patterns'],
  },
  notification: {
    adapters: ['GenUXFeedback.tsx'],
    styles: feedbackSources,
    tests: ['patterns'],
  },
  modal: {
    adapters: ['GenUXFeedback.tsx'],
    styles: feedbackSources,
    tests: ['patterns'],
  },
  popconfirm: {
    adapters: ['GenUXFeedback.tsx'],
    styles: feedbackSources,
    tests: ['patterns'],
  },
  'date-time': {
    adapters: ['GenUXDateTime.tsx'],
    styles: ['genux-date-time.css', 'data-entry-catalog.css'],
    tests: ['patterns'],
  },
  'data-table': {
    styles: ['workspace.css', 'workspace-collections.css', 'genux-avatar.css', 'kit-identity.css'],
    tests: ['workspace', 'kit-collections'],
  },
  'collection-views': {
    styles: ['workspace.css', 'workspace-collections.css', 'genux-avatar.css', 'kit-identity.css'],
    tests: ['workspace', 'kit-collections'],
  },
  'record-details': {
    styles: ['workspace.css', 'workspace-details.css'],
    tests: ['workspace', 'kit-records'],
  },
  'record-forms': {
    styles: ['workspace.css', 'workspace-forms.css'],
    tests: ['workspace'],
  },
  'record-workspace': {
    styles: [
      'workspace.css',
      'workspace-connected.css',
      'kit-collections.css',
      'kit-records.css',
      'genux-avatar.css',
      'kit-identity.css',
    ],
    tests: ['workspace-kit-core', 'kit-records', 'kit-collections'],
    browserTests: ['ux-collection.spec.ts'],
  },
  media: {
    adapters: ['GenUXMediaFrame.tsx', 'GenUXScreenshot.tsx'],
    styles: ['genux-media.css', 'genux-screenshot.css'],
    tests: [],
    browserTests: uxCompletionTests,
    catalogFiles: uxPatternCatalog,
  },
  'content-patterns': {
    adapters: ['GenUXIconList.tsx', 'GenUXQuote.tsx', 'GenUXAvatarGroup.tsx', 'GenUXAvatar.tsx'],
    styles: ['genux-avatar.css', 'genux-content-patterns.css'],
    tests: [],
    browserTests: uxCompletionTests,
    catalogFiles: uxPatternCatalog,
  },
  carousel: {
    adapters: ['GenUXCarousel.tsx', 'GenUXMediaFrame.tsx'],
    styles: ['genux-media.css', 'genux-carousel.css'],
    tests: [],
    browserTests: uxCompletionTests,
    catalogFiles: uxPatternCatalog,
  },
  upload: {
    adapters: ['GenUXUpload.tsx'],
    styles: ['genux-upload.css'],
    tests: [],
    browserTests: uxCompletionTests,
    catalogFiles: uxPatternCatalog,
  },
  'rich-menu': {
    adapters: ['GenUXRichMenu.tsx', 'GenUXDropdown.tsx'],
    styles: ['genux-dropdown.css', 'genux-rich-menu.css'],
    tests: [],
    browserTests: uxCompletionTests,
    catalogFiles: uxPatternCatalog,
  },
  chart: {
    adapters: ['GenUXChart.tsx'],
    styles: ['genux-chart.css'],
    tests: [],
    browserTests: uxCompletionTests,
    catalogFiles: uxPatternCatalog,
  },
  listy: {
    adapters: [
      'ListyBasicPatterns.tsx',
      'ListyControlPatterns.tsx',
      'ListyReorderPattern.tsx',
      'ListyDataPatterns.tsx',
      'GenUXListy.tsx',
      'GenUXListyItem.tsx',
      'GenUXAvatar.tsx',
    ],
    styles: ['genux-listy.css', 'genux-avatar.css', 'genux-selection-variants.css'],
    tests: [],
    browserTests: ['listy-cascader.spec.ts'],
    catalogFiles: ['catalog-listy.ts'],
  },
  badge: {
    adapters: ['GenUXBadge.tsx', 'GenUXButton.tsx', 'GenUXAvatar.tsx'],
    styles: ['genux-badge.css', 'genux-avatar.css'],
    tests: [],
    browserTests: ['badge-radius.spec.ts'],
    catalogFiles: ['catalog-badge.ts'],
  },
  fab: {
    adapters: [
      'GenUXFab.tsx',
      'fab/useFab.ts',
      'fab/useFabPosition.ts',
      'fab/FabIcon.tsx',
      'GenUXButton.tsx',
      'GenUXBadge.tsx',
      'GenUXOverlay.tsx',
    ],
    modelFiles: ['fab/types.ts', 'fab/options.ts', 'fab/geometry.ts', 'fab/motion.ts'],
    styles: ['genux-fab.css', 'genux-badge.css'],
    tests: ['fab', 'component-motion', 'interaction-stability'],
    browserTests: ['fab.spec.ts'],
    supportFiles: ['docs/tests/fab-harness.mjs', 'tools/fab-motion-guard.mjs'],
    catalogFiles: ['catalog-fab.ts', 'fab-tokens.json'],
  },
};

/** Import binding the generated example uses for one stylesheet file name. */
const styleBinding = (file: string) =>
  file
    .slice(0, -'.css'.length)
    .split('-')
    .map((part, index) => (index ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join('') + 'Styles';

/** Astro page source that renders the route's island with the route's stylesheets. */
export function astroExample(
  component: ComponentDoc,
  sheetFiles: readonly string[],
): string | undefined {
  const island = componentRoutes[component.slug];
  if (!componentSources[component.slug] || !island) return undefined;
  const binding = islandBinding(island);
  const named = island.exportName !== 'default';
  const headLinks = sheetFiles.length
    ? [
        '  <Fragment slot="head">',
        ...sheetFiles.map(file => `    <link rel="stylesheet" href={${styleBinding(file)}} />`),
        '  </Fragment>',
      ]
    : [];
  return [
    '---',
    '// src/pages/example.astro',
    "import DocsLayout from '../layouts/DocsLayout.astro';",
    `import ${named ? `{ ${binding} }` : binding} from '../react/${island.module}';`,
    ...sheetFiles.map(file => `import ${styleBinding(file)} from '../styles/${file}?url';`),
    '---',
    '',
    `<DocsLayout title="${component.title}" description="Static page with one trusted React island.">`,
    ...headLinks,
    `  <${binding} documentation client:load />`,
    '</DocsLayout>',
  ].join('\n');
}

/** Source groups listed under "Source and resources", as repository-relative paths. */
export function resourceGroups(slug: string) {
  const sources = componentSources[slug];
  const island = componentRoutes[slug];
  const adapterPaths =
    sources && island
      ? [
          ...[island.module + '.tsx', ...(sources.adapters ?? []), 'ExamplePreview.tsx'].map(
            file => 'docs/src/react/' + file,
          ),
          ...(sources.modelFiles ?? []).map(file => 'docs/src/' + file),
        ]
      : [];
  return [
    {
      kind: 'catalog',
      label: 'Component catalog data',
      paths: [
        ...(sources?.catalogFiles ?? []).map(file => 'docs/src/data/' + file),
        'docs/src/data/catalog.ts',
      ],
    },
    {
      kind: 'route',
      label: 'Astro route and layout',
      paths: [
        'docs/src/pages/components/[slug].astro',
        'docs/src/layouts/DocsLayout.astro',
        'docs/src/components/DocumentationNav.astro',
        'docs/src/pages/preview-code/[id].json.ts',
        'tools/docs-preview-code.mjs',
      ],
    },
    {
      kind: 'adapter',
      label: 'React adapters',
      paths: adapterPaths,
    },
    {
      kind: 'styles',
      label: 'Styles and tokens',
      paths: [
        ...(sources?.styles ?? []).map(file => 'docs/src/styles/' + file),
        'docs/src/styles/preview-document.css',
        'docs/src/styles/preview-workbench.css',
        'docs/src/components/shell/layout.css',
        'docs/src/styles/docs.css',
        'docs/src/styles/documentation.css',
        'docs/src/theme.ts',
      ],
    },
    { kind: 'instructions', label: 'Agent instructions', paths: ['docs/AGENTS.md', 'AGENTS.md'] },
    {
      kind: 'tests',
      label: 'Regression tests',
      paths: [
        ...[...(sources?.tests ?? []), 'documentation-presentation'].map(
          name => 'docs/tests/' + name + '.test.mjs',
        ),
        ...(sources?.browserTests ?? []).map(file => 'docs/browser/' + file),
        ...(sources?.supportFiles ?? []),
      ],
    },
    {
      kind: 'genux',
      label: 'GenUX contracts and trusted renderer',
      paths: [
        'docs/src/genux/contracts.ts',
        'docs/src/genux/policy.ts',
        'docs/src/react/genux/GenUXSurface.tsx',
      ],
    },
  ];
}

const sectionLabels: Record<string, string> = documentationRules.sectionLabels;
export const componentSectionItems = documentationRules.componentSections.map(id => ({
  id,
  label: sectionLabels[id] ?? id,
}));

// The article footer names the package release from package.json, major and minor only.
export const releaseVersion = packageManifest.version.split('.').slice(0, 2).join('.');

/** Previous and next follow the visible catalog order of the sidebar and the catalog page. */
export function catalogNeighbors(slug: string) {
  const position = catalogOrder.findIndex(item => item.slug === slug);
  return {
    previous: position > 0 ? catalogOrder.at(position - 1) : undefined,
    next: position >= 0 ? catalogOrder.at(position + 1) : undefined,
  };
}

// Four tabs group the eight sections without moving them; docs-page.ts applies them after load
// and every section stays readable without JavaScript.
export const componentTabGroups = [
  { id: 'overview', label: 'Overview', sections: ['usage', 'accessibility', 'notes'] },
  { id: 'examples', label: 'Examples', sections: ['examples'] },
  { id: 'api', label: 'API', sections: ['api'] },
  { id: 'integration', label: 'Integration', sections: ['code', 'astro', 'resources'] },
];

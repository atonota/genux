// Build-time documentation ownership only. No template is hydrated or imports product demos.
import type { ComponentType } from 'react';
import type { TemplateProps, HubProps } from './content';
import Button, * as ButtonPage from './components/Button';
import Input, * as InputPage from './components/Input';
import AutoComplete, * as AutoCompletePage from './components/AutoComplete';
import Cascader, * as CascaderPage from './components/Cascader';
import Select, * as SelectPage from './components/Select';
import Checkbox, * as CheckboxPage from './components/Checkbox';
import Radio, * as RadioPage from './components/Radio';
import Switch, * as SwitchPage from './components/Switch';
import Slider, * as SliderPage from './components/Slider';
import Accordion, * as AccordionPage from './components/Accordion';
import Form, * as FormPage from './components/Form';
import Drawer, * as DrawerPage from './components/Drawer';
import Pill, * as PillPage from './components/Pill';
import Dropdown, * as DropdownPage from './components/Dropdown';
import Pagination, * as PaginationPage from './components/Pagination';
import Steps, * as StepsPage from './components/Steps';
import Breadcrumb, * as BreadcrumbPage from './components/Breadcrumb';
import Splitter, * as SplitterPage from './components/Splitter';
import Card, * as CardPage from './components/Card';
import DataTable, * as DataTablePage from './components/DataTable';
import CollectionViews, * as CollectionViewsPage from './components/CollectionViews';
import RecordDetails, * as RecordDetailsPage from './components/RecordDetails';
import RecordForms, * as RecordFormsPage from './components/RecordForms';
import RecordWorkspace, * as RecordWorkspacePage from './components/RecordWorkspace';
import Toast, * as ToastPage from './components/Toast';
import Alert, * as AlertPage from './components/Alert';
import Notification, * as NotificationPage from './components/Notification';
import Modal, * as ModalPage from './components/Modal';
import Popconfirm, * as PopconfirmPage from './components/Popconfirm';
import DateTime, * as DateTimePage from './components/DateTime';
import EmptyState, * as EmptyStatePage from './components/EmptyState';
import Avatar, * as AvatarPage from './components/Avatar';
import Media, * as MediaPage from './components/Media';
import ContentPatterns, * as ContentPatternsPage from './components/ContentPatterns';
import Carousel, * as CarouselPage from './components/Carousel';
import Upload, * as UploadPage from './components/Upload';
import RichMenu, * as RichMenuPage from './components/RichMenu';
import Chart, * as ChartPage from './components/Chart';
import Listy, * as ListyPage from './components/Listy';
import Badge, * as BadgePage from './components/Badge';
import Fab, * as FabPage from './components/Fab';
import Guides, * as GuidesPage from './hubs/Guides';
import Foundations, * as FoundationsPage from './hubs/Foundations';
import Tools, * as ToolsPage from './hubs/Tools';
import Project, * as ProjectPage from './hubs/Project';

interface PageOwner<Props> {
  Template: ComponentType<Props>;
  title: string;
  description: string;
  sourcePath: string;
}
export const componentTemplates: Readonly<Record<string, PageOwner<TemplateProps>>> = {
  button: {
    Template: Button,
    title: ButtonPage.title,
    description: ButtonPage.description,
    sourcePath: 'docs/src/templates/components/Button.tsx',
  },
  input: {
    Template: Input,
    title: InputPage.title,
    description: InputPage.description,
    sourcePath: 'docs/src/templates/components/Input.tsx',
  },
  autocomplete: {
    Template: AutoComplete,
    title: AutoCompletePage.title,
    description: AutoCompletePage.description,
    sourcePath: 'docs/src/templates/components/AutoComplete.tsx',
  },
  cascader: {
    Template: Cascader,
    title: CascaderPage.title,
    description: CascaderPage.description,
    sourcePath: 'docs/src/templates/components/Cascader.tsx',
  },
  select: {
    Template: Select,
    title: SelectPage.title,
    description: SelectPage.description,
    sourcePath: 'docs/src/templates/components/Select.tsx',
  },
  checkbox: {
    Template: Checkbox,
    title: CheckboxPage.title,
    description: CheckboxPage.description,
    sourcePath: 'docs/src/templates/components/Checkbox.tsx',
  },
  radio: {
    Template: Radio,
    title: RadioPage.title,
    description: RadioPage.description,
    sourcePath: 'docs/src/templates/components/Radio.tsx',
  },
  switch: {
    Template: Switch,
    title: SwitchPage.title,
    description: SwitchPage.description,
    sourcePath: 'docs/src/templates/components/Switch.tsx',
  },
  slider: {
    Template: Slider,
    title: SliderPage.title,
    description: SliderPage.description,
    sourcePath: 'docs/src/templates/components/Slider.tsx',
  },
  accordion: {
    Template: Accordion,
    title: AccordionPage.title,
    description: AccordionPage.description,
    sourcePath: 'docs/src/templates/components/Accordion.tsx',
  },
  form: {
    Template: Form,
    title: FormPage.title,
    description: FormPage.description,
    sourcePath: 'docs/src/templates/components/Form.tsx',
  },
  drawer: {
    Template: Drawer,
    title: DrawerPage.title,
    description: DrawerPage.description,
    sourcePath: 'docs/src/templates/components/Drawer.tsx',
  },
  pill: {
    Template: Pill,
    title: PillPage.title,
    description: PillPage.description,
    sourcePath: 'docs/src/templates/components/Pill.tsx',
  },
  dropdown: {
    Template: Dropdown,
    title: DropdownPage.title,
    description: DropdownPage.description,
    sourcePath: 'docs/src/templates/components/Dropdown.tsx',
  },
  pagination: {
    Template: Pagination,
    title: PaginationPage.title,
    description: PaginationPage.description,
    sourcePath: 'docs/src/templates/components/Pagination.tsx',
  },
  steps: {
    Template: Steps,
    title: StepsPage.title,
    description: StepsPage.description,
    sourcePath: 'docs/src/templates/components/Steps.tsx',
  },
  breadcrumb: {
    Template: Breadcrumb,
    title: BreadcrumbPage.title,
    description: BreadcrumbPage.description,
    sourcePath: 'docs/src/templates/components/Breadcrumb.tsx',
  },
  splitter: {
    Template: Splitter,
    title: SplitterPage.title,
    description: SplitterPage.description,
    sourcePath: 'docs/src/templates/components/Splitter.tsx',
  },
  card: {
    Template: Card,
    title: CardPage.title,
    description: CardPage.description,
    sourcePath: 'docs/src/templates/components/Card.tsx',
  },
  'data-table': {
    Template: DataTable,
    title: DataTablePage.title,
    description: DataTablePage.description,
    sourcePath: 'docs/src/templates/components/DataTable.tsx',
  },
  'collection-views': {
    Template: CollectionViews,
    title: CollectionViewsPage.title,
    description: CollectionViewsPage.description,
    sourcePath: 'docs/src/templates/components/CollectionViews.tsx',
  },
  'record-details': {
    Template: RecordDetails,
    title: RecordDetailsPage.title,
    description: RecordDetailsPage.description,
    sourcePath: 'docs/src/templates/components/RecordDetails.tsx',
  },
  'record-forms': {
    Template: RecordForms,
    title: RecordFormsPage.title,
    description: RecordFormsPage.description,
    sourcePath: 'docs/src/templates/components/RecordForms.tsx',
  },
  'record-workspace': {
    Template: RecordWorkspace,
    title: RecordWorkspacePage.title,
    description: RecordWorkspacePage.description,
    sourcePath: 'docs/src/templates/components/RecordWorkspace.tsx',
  },
  toast: {
    Template: Toast,
    title: ToastPage.title,
    description: ToastPage.description,
    sourcePath: 'docs/src/templates/components/Toast.tsx',
  },
  alert: {
    Template: Alert,
    title: AlertPage.title,
    description: AlertPage.description,
    sourcePath: 'docs/src/templates/components/Alert.tsx',
  },
  notification: {
    Template: Notification,
    title: NotificationPage.title,
    description: NotificationPage.description,
    sourcePath: 'docs/src/templates/components/Notification.tsx',
  },
  modal: {
    Template: Modal,
    title: ModalPage.title,
    description: ModalPage.description,
    sourcePath: 'docs/src/templates/components/Modal.tsx',
  },
  popconfirm: {
    Template: Popconfirm,
    title: PopconfirmPage.title,
    description: PopconfirmPage.description,
    sourcePath: 'docs/src/templates/components/Popconfirm.tsx',
  },
  'date-time': {
    Template: DateTime,
    title: DateTimePage.title,
    description: DateTimePage.description,
    sourcePath: 'docs/src/templates/components/DateTime.tsx',
  },
  'empty-state': {
    Template: EmptyState,
    title: EmptyStatePage.title,
    description: EmptyStatePage.description,
    sourcePath: 'docs/src/templates/components/EmptyState.tsx',
  },
  avatar: {
    Template: Avatar,
    title: AvatarPage.title,
    description: AvatarPage.description,
    sourcePath: 'docs/src/templates/components/Avatar.tsx',
  },
  media: {
    Template: Media,
    title: MediaPage.title,
    description: MediaPage.description,
    sourcePath: 'docs/src/templates/components/Media.tsx',
  },
  'content-patterns': {
    Template: ContentPatterns,
    title: ContentPatternsPage.title,
    description: ContentPatternsPage.description,
    sourcePath: 'docs/src/templates/components/ContentPatterns.tsx',
  },
  carousel: {
    Template: Carousel,
    title: CarouselPage.title,
    description: CarouselPage.description,
    sourcePath: 'docs/src/templates/components/Carousel.tsx',
  },
  upload: {
    Template: Upload,
    title: UploadPage.title,
    description: UploadPage.description,
    sourcePath: 'docs/src/templates/components/Upload.tsx',
  },
  'rich-menu': {
    Template: RichMenu,
    title: RichMenuPage.title,
    description: RichMenuPage.description,
    sourcePath: 'docs/src/templates/components/RichMenu.tsx',
  },
  chart: {
    Template: Chart,
    title: ChartPage.title,
    description: ChartPage.description,
    sourcePath: 'docs/src/templates/components/Chart.tsx',
  },
  listy: {
    Template: Listy,
    title: ListyPage.title,
    description: ListyPage.description,
    sourcePath: 'docs/src/templates/components/Listy.tsx',
  },
  badge: {
    Template: Badge,
    title: BadgePage.title,
    description: BadgePage.description,
    sourcePath: 'docs/src/templates/components/Badge.tsx',
  },
  fab: {
    Template: Fab,
    title: FabPage.title,
    description: FabPage.description,
    sourcePath: 'docs/src/templates/components/Fab.tsx',
  },
};

export const hubTemplates: Readonly<Record<string, PageOwner<HubProps>>> = {
  guides: {
    Template: Guides,
    title: GuidesPage.title,
    description: GuidesPage.description,
    sourcePath: 'docs/src/templates/hubs/Guides.tsx',
  },
  foundations: {
    Template: Foundations,
    title: FoundationsPage.title,
    description: FoundationsPage.description,
    sourcePath: 'docs/src/templates/hubs/Foundations.tsx',
  },
  tools: {
    Template: Tools,
    title: ToolsPage.title,
    description: ToolsPage.description,
    sourcePath: 'docs/src/templates/hubs/Tools.tsx',
  },
  project: {
    Template: Project,
    title: ProjectPage.title,
    description: ProjectPage.description,
    sourcePath: 'docs/src/templates/hubs/Project.tsx',
  },
};

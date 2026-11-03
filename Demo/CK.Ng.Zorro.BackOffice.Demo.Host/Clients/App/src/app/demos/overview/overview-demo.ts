import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutContent } from '@local/ck-gen';

interface ComponentCard {
  name: string;
  description: string;
  route: string;
  package: string;
}

@Component( {
  selector: 'app-overview-demo',
  imports: [CommonModule, LayoutContent, RouterLink],
  templateUrl: './overview-demo.html',
  styleUrl: './overview-demo.less'
} )
export class OverviewDemo {

  basicComponents: Array<ComponentCard> = [
    { name: 'Table', description: 'Data table with sorting, pagination, search and row selection.', route: '/basic/table', package: 'Basic' },
    { name: 'ListView', description: 'Mobile-friendly list with custom item templates and search.', route: '/basic/list-view', package: 'Basic' },
    { name: 'ActionBar', description: 'Toolbar with left/right action buttons, icons and danger states.', route: '/basic/action-bar', package: 'Basic' },
    { name: 'Filters', description: 'Switch and select filters for data filtering.', route: '/basic/filters', package: 'Basic' },
    { name: 'AdaptivePageLayout', description: 'Responsive layout that switches between table and list view.', route: '/basic/adaptive-page-layout', package: 'Basic' },
    { name: 'SplitView', description: 'Master-detail layout with responsive sidebar collapse.', route: '/basic/split-view', package: 'Basic' },
    { name: 'SelectableList', description: 'List with single or multi-select support and custom templates.', route: '/basic/selectable-list', package: 'Basic' },
    { name: 'InlineEdit', description: 'Click-to-edit text input with confirm/cancel.', route: '/basic/inline-edit', package: 'Basic' },
    { name: 'SimpleInfoBox', description: 'Simple label/value display box.', route: '/basic/simple-info-box', package: 'Basic' },
    { name: 'Blockquote', description: 'Styled blockquote for messages and callouts.', route: '/basic/blockquote', package: 'Basic' },
    { name: 'Loader', description: 'Loading spinner overlay for content areas.', route: '/basic/loader', package: 'Basic' },
    { name: 'GenericForm', description: 'Dynamic form builder with validation and field types.', route: '/basic/generic-form', package: 'Basic' },
  ];

  backofficeComponents: Array<ComponentCard> = [
    { name: 'Layout', description: 'Main application shell with sidebar, topbar and mobile support.', route: '/backoffice/layout', package: 'BackOffice' },
    { name: 'LayoutContent', description: 'Content wrapper with header, breadcrumb, filters and actions.', route: '/backoffice/layout-content', package: 'BackOffice' },
    { name: 'TopBar', description: 'Top navigation bar with user menu, WCS and theme toggle.', route: '/backoffice/top-bar', package: 'BackOffice' },
    { name: 'SideBar', description: 'Collapsible sidebar with navigation sections and search.', route: '/backoffice/side-bar', package: 'BackOffice' },
    { name: 'MobileBar', description: 'Bottom navigation bar for mobile viewports.', route: '/backoffice/mobile-bar', package: 'BackOffice' },
    { name: 'SearchModal', description: 'Global search modal with debounced input and custom templates.', route: '/backoffice/search-modal', package: 'BackOffice' },
  ];

  otherComponents: Array<ComponentCard> = [
    { name: 'Breadcrumb', description: 'Breadcrumb navigation with icons and truncation.', route: '/breadcrumb', package: 'Breadcrumb' },
  ];
}

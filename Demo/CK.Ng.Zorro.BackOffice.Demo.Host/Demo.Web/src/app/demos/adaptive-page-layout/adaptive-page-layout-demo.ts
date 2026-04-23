import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import {
  ActionBarContent,
  AdaptivePageLayout,
  DefaultTableColumn,
  Filter,
  LayoutContent,
  SelectFilter,
  SwitchFilter,
  TableAction,
  TableColumn,
} from '@local/ck-gen';

interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
  completed: boolean;
}

@Component( {
  selector: 'app-adaptive-page-layout-demo',
  imports: [CommonModule, LayoutContent, AdaptivePageLayout],
  templateUrl: './adaptive-page-layout-demo.html',
  styleUrl: './adaptive-page-layout-demo.less'
} )
export class AdaptivePageLayoutDemo {
  allItems: Array<Task> = [
    { id: 1, title: 'Setup CI/CD pipeline', priority: 'High', status: 'Done', completed: true },
    { id: 2, title: 'Write unit tests', priority: 'High', status: 'In Progress', completed: false },
    { id: 3, title: 'Design landing page', priority: 'Medium', status: 'Todo', completed: false },
    { id: 4, title: 'Fix login bug', priority: 'High', status: 'Done', completed: true },
    { id: 5, title: 'Update dependencies', priority: 'Low', status: 'Todo', completed: false },
    { id: 6, title: 'Code review PR #42', priority: 'Medium', status: 'In Progress', completed: false },
    { id: 7, title: 'Deploy to staging', priority: 'High', status: 'Done', completed: true },
    { id: 8, title: 'Write documentation', priority: 'Low', status: 'Todo', completed: false },
  ];

  items: Array<Task> = [...this.allItems];

  columns: Array<TableColumn<Task>> = [
    { name: 'id', displayedName: '#', hidden: false, showInMobile: true, sortable: true, sortFn: ( a, b ) => a.id - b.id },
    { name: 'title', displayedName: 'Title', hidden: false, showInMobile: true, sortable: true, sortFn: ( a, b ) => a.title.localeCompare( b.title ) },
    { name: 'priority', displayedName: 'Priority', hidden: false, showInMobile: true, sortable: true, sortFn: ( a, b ) => a.priority.localeCompare( b.priority ) },
    { name: 'status', displayedName: 'Status', hidden: false, showInMobile: true, sortable: false },
    new DefaultTableColumn( 'completed', 'Completed', { hidden: false, valueFormatter: ( v: unknown ) => v ? 'Yes' : 'No' } ),
  ];

  actions: ActionBarContent<Task> = {
    left: [],
    right: [
      { name: 'add', displayName: 'Add Task', icon: faPlus, isDanger: false, shouldBeDisplayed: () => true, execute: () => alert( 'Add task' ) }
    ]
  };

  tableActions: Array<TableAction<Task>> = [
    { name: 'View', icon: faEye, isDanger: false, type: 'default', execute: ( item ) => alert( `View: ${item.title}` ), shouldBeDisplayed: () => true }
  ];

  filters: Array<Filter<unknown>> = [
    new SwitchFilter( 'Completed', true, false, '' ),
    new SelectFilter<string>(
      'multiple',
      'Priority',
      [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' },
      ],
      { defaultValue: ['High', 'Medium', 'Low'], active: false, placeholder: 'Select priorities' }
    )
  ];

  searchFunc = ( input: string ): Array<Task> => {
    if ( !input ) return [...this.allItems];
    const lower = input.toLowerCase();
    return this.allItems.filter( i => i.title.toLowerCase().includes( lower ) );
  };

  filterFunc = (): Array<Task> => {
    const active = this.filters.filter( f => f.active );
    if ( active.length === 0 ) return [...this.allItems];

    let result = [...this.allItems];
    active.forEach( f => {
      if ( f.label === 'Completed' ) result = result.filter( i => i.completed === f.value );
      if ( f.label === 'Priority' ) result = result.filter( i => ( f.value as Array<string> ).includes( i.priority ) );
    } );
    return result;
  };

  onDblClick = ( item: Task ): void => {
    alert( `Double-clicked: ${item.title}` );
  };
}

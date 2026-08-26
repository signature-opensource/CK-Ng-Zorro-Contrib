import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import {
  ActionBarContent,
  AdaptivePageLayout,
  DateRangeFilter,
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
  assignee: string;
  sprint: string;
  due: Date;
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
    { id: 1, title: 'Setup CI/CD pipeline', priority: 'High', status: 'Done', assignee: 'Alice', sprint: 'Sprint 1', due: new Date( 2026, 6, 5 ), completed: true },
    { id: 2, title: 'Write unit tests', priority: 'High', status: 'In Progress', assignee: 'Bob', sprint: 'Sprint 1', due: new Date( 2026, 6, 12 ), completed: false },
    { id: 3, title: 'Design landing page', priority: 'Medium', status: 'Todo', assignee: 'Carol', sprint: 'Sprint 2', due: new Date( 2026, 6, 20 ), completed: false },
    { id: 4, title: 'Fix login bug', priority: 'High', status: 'Done', assignee: 'Alice', sprint: 'Sprint 1', due: new Date( 2026, 5, 28 ), completed: true },
    { id: 5, title: 'Update dependencies', priority: 'Low', status: 'Todo', assignee: 'Bob', sprint: 'Backlog', due: new Date( 2026, 7, 3 ), completed: false },
    { id: 6, title: 'Code review PR #42', priority: 'Medium', status: 'In Progress', assignee: 'Carol', sprint: 'Sprint 2', due: new Date( 2026, 6, 15 ), completed: false },
    { id: 7, title: 'Deploy to staging', priority: 'High', status: 'Done', assignee: 'Alice', sprint: 'Sprint 2', due: new Date( 2026, 6, 8 ), completed: true },
    { id: 8, title: 'Write documentation', priority: 'Low', status: 'Todo', assignee: 'Bob', sprint: 'Backlog', due: new Date( 2026, 7, 10 ), completed: false },
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
    new SwitchFilter( 'Completed', false, true, '' ),
    new SelectFilter<string>(
      'multiple',
      'Priority',
      [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' },
      ],
      { defaultValue: ['High', 'Medium'], active: true, placeholder: 'Select priorities' }
    ),
    new SelectFilter<string>(
      'multiple',
      'Status',
      [
        { label: 'Todo', value: 'Todo' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Done', value: 'Done' },
      ],
      { defaultValue: ['Todo', 'In Progress', 'Done'], active: true, placeholder: 'Select statuses' }
    ),
    new SelectFilter<string>(
      'multiple',
      'Assignee',
      [
        { label: 'Alice', value: 'Alice' },
        { label: 'Bob', value: 'Bob' },
        { label: 'Carol', value: 'Carol' },
      ],
      { active: true, placeholder: 'Select assignees' }
    ),
    new SelectFilter<string>(
      'default',
      'Sprint',
      [
        { label: 'Sprint 1', value: 'Sprint 1' },
        { label: 'Sprint 2', value: 'Sprint 2' },
        { label: 'Backlog', value: 'Backlog' },
      ],
      { active: true, placeholder: 'Select a sprint' }
    ),
    new DateRangeFilter( 'Due', {
      placeholder: ['From', 'To'],
      presets: {
        'This month': () => {
          const now = new Date();
          return [new Date( now.getFullYear(), now.getMonth(), 1 ), now];
        }
      }
    } ),
    new SwitchFilter( 'Overdue only', false, false, '' )
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
      const hasSelection = Array.isArray( f.value ) && f.value.length > 0;
      if ( f.label === 'Completed' ) result = result.filter( i => i.completed === f.value );
      if ( f.label === 'Priority' && hasSelection ) result = result.filter( i => ( f.value as Array<string> ).includes( i.priority ) );
      if ( f.label === 'Status' && hasSelection ) result = result.filter( i => ( f.value as Array<string> ).includes( i.status ) );
      if ( f.label === 'Assignee' && hasSelection ) result = result.filter( i => ( f.value as Array<string> ).includes( i.assignee ) );
      if ( f.label === 'Sprint' && f.value ) result = result.filter( i => i.sprint === f.value );
      if ( f.label === 'Due' && f.value ) {
        const [start, end] = f.value as [Date, Date];
        result = result.filter( i => i.due >= start && i.due <= end );
      }
      if ( f.label === 'Overdue only' && f.value === true ) {
        const now = new Date();
        result = result.filter( i => i.due < now && !i.completed );
      }
    } );
    return result;
  };

  onDblClick = ( item: Task ): void => {
    alert( `Double-clicked: ${item.title}` );
  };
}

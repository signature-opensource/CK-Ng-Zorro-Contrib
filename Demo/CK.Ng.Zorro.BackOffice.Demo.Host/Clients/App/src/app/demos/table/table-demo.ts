import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  DefaultTableColumn,
  TableColumn,
  TableAction,
  Table,
  LayoutContent
} from '@local/ck-gen';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: DateTime;
  active: boolean;
}

@Component( {
  selector: 'app-table-demo',
  imports: [CommonModule, LayoutContent, Table],
  templateUrl: './table-demo.html',
  styleUrl: './table-demo.less'
} )
export class TableDemo {
  items: Array<User> = [
    { id: 1, name: 'Alice Martin', email: 'alice@example.com', role: 'Admin', joinDate: DateTime.fromISO( '2023-01-15' ), active: true },
    { id: 2, name: 'Bob Dupont', email: 'bob@example.com', role: 'Editor', joinDate: DateTime.fromISO( '2023-03-22' ), active: true },
    { id: 3, name: 'Claire Moreau', email: 'claire@example.com', role: 'Viewer', joinDate: DateTime.fromISO( '2023-06-10' ), active: false },
    { id: 4, name: 'David Bernard', email: 'david@example.com', role: 'Editor', joinDate: DateTime.fromISO( '2023-08-05' ), active: true },
    { id: 5, name: 'Emma Petit', email: 'emma@example.com', role: 'Admin', joinDate: DateTime.fromISO( '2022-11-30' ), active: true },
    { id: 6, name: 'François Roux', email: 'francois@example.com', role: 'Viewer', joinDate: DateTime.fromISO( '2024-01-12' ), active: false },
    { id: 7, name: 'Géraldine Thomas', email: 'geraldine@example.com', role: 'Editor', joinDate: DateTime.fromISO( '2023-09-18' ), active: true },
    { id: 8, name: 'Hugo Robert', email: 'hugo@example.com', role: 'Viewer', joinDate: DateTime.fromISO( '2024-02-28' ), active: true },
    { id: 9, name: 'Isabelle Richard', email: 'isabelle@example.com', role: 'Admin', joinDate: DateTime.fromISO( '2022-07-04' ), active: true },
    { id: 10, name: 'Julien Blanc', email: 'julien@example.com', role: 'Editor', joinDate: DateTime.fromISO( '2023-12-01' ), active: false },
    { id: 11, name: 'Karine Leroy', email: 'karine@example.com', role: 'Viewer', joinDate: DateTime.fromISO( '2024-04-15' ), active: true },
    { id: 12, name: 'Lucas Garnier', email: 'lucas@example.com', role: 'Editor', joinDate: DateTime.fromISO( '2023-05-20' ), active: true },
  ];

  #allItems = [...this.items];

  columns: Array<TableColumn<User>> = [
    {
      name: 'id',
      displayedName: '#',
      hidden: false,
      showInMobile: true,
      sortable: true,
      sortFn: ( a, b ) => a.id - b.id,
      width: '60px'
    },
    {
      name: 'name',
      displayedName: 'Name',
      hidden: false,
      showInMobile: true,
      sortable: true,
      sortFn: ( a, b ) => a.name.localeCompare( b.name ),
      width: '200px'
    },
    {
      name: 'email',
      displayedName: 'Email',
      hidden: false,
      showInMobile: false,
      sortable: true,
      sortFn: ( a, b ) => a.email.localeCompare( b.email )
    },
    {
      name: 'role',
      displayedName: 'Role',
      hidden: false,
      showInMobile: true,
      sortable: true,
      sortFn: ( a, b ) => a.role.localeCompare( b.role ),
      width: '100px'
    },
    new DefaultTableColumn( 'joinDate', 'Joined', {
      hidden: false,
      sortable: true,
      sortFn: ( a, b ) => a.joinDate.toMillis() - b.joinDate.toMillis(),
      valueFormatter: ( _v: unknown, row: User ) => row.joinDate.toLocaleString( DateTime.DATE_MED ),
      width: '140px'
    } ),
    new DefaultTableColumn( 'active', 'Active', {
      hidden: false,
      showInMobile: true,
      valueFormatter: ( value: unknown ) => value ? 'Yes' : 'No',
      width: '80px'
    } )
  ];

  tableActions: Array<TableAction<User>> = [
    {
      name: 'View',
      icon: faEye,
      isDanger: false,
      type: 'default',
      execute: ( item ) => alert( `View: ${item.name}` ),
      shouldBeDisplayed: () => true,
    },
    {
      name: 'Delete',
      icon: faTrash,
      isDanger: true,
      type: 'default',
      execute: ( item ) => alert( `Delete: ${item.name}` ),
      shouldBeDisplayed: () => true,
    }
  ];

  selectedItems: Array<User> = [];

  onSelectionChanged( items: Array<User> ): void {
    this.selectedItems = items;
  }

  search( s: string ): void {
    if ( !s ) {
      this.items = [...this.#allItems];
      return;
    }
    const lower = s.toLowerCase();
    this.items = this.#allItems.filter( i =>
      i.name.toLowerCase().includes( lower ) ||
      i.email.toLowerCase().includes( lower ) ||
      i.role.toLowerCase().includes( lower )
    );
  }

  clearSearch(): void {
    this.items = [...this.#allItems];
  }
}

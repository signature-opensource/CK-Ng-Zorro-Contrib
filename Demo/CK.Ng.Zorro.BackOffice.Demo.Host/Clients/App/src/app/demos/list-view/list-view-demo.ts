import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ListView, LayoutContent } from '@local/ck-gen';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component( {
  selector: 'app-list-view-demo',
  imports: [CommonModule, LayoutContent, ListView],
  templateUrl: './list-view-demo.html',
  styleUrl: './list-view-demo.less'
} )
export class ListViewDemo {
  items: Array<User> = [
    { id: 1, name: 'Alice Martin', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Dupont', email: 'bob@example.com', role: 'Editor' },
    { id: 3, name: 'Claire Moreau', email: 'claire@example.com', role: 'Viewer' },
    { id: 4, name: 'David Bernard', email: 'david@example.com', role: 'Editor' },
    { id: 5, name: 'Emma Petit', email: 'emma@example.com', role: 'Admin' },
    { id: 6, name: 'François Roux', email: 'francois@example.com', role: 'Viewer' },
  ];

  #allItems = [...this.items];
  log: Array<string> = [];

  search( s: string ): void {
    if ( !s ) {
      this.items = [...this.#allItems];
      return;
    }
    const lower = s.toLowerCase();
    this.items = this.#allItems.filter( i =>
      i.name.toLowerCase().includes( lower ) || i.email.toLowerCase().includes( lower )
    );
  }

  clearSearch(): void {
    this.items = [...this.#allItems];
  }

  onDblClick( item: User ): void {
    this.log = [`[dblclick] ${item.name} (${item.role})`, ...this.log.slice( 0, 19 )];
  }
}

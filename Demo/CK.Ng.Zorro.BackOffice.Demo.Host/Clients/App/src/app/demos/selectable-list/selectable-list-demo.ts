import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SelectableList, LayoutContent } from '@local/ck-gen';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';

interface DemoItem {
  id: number;
  name: string;
  category: string;
}

@Component( {
  selector: 'app-selectable-list-demo',
  imports: [CommonModule, FormsModule, LayoutContent, SelectableList, NzButtonModule, NzSwitchModule],
  templateUrl: './selectable-list-demo.html',
  styleUrl: './selectable-list-demo.less'
} )
export class SelectableListDemo {
  multiSelect = false;
  selectedItems: Array<DemoItem> = [];
  log: Array<string> = [];

  items: Array<DemoItem> = [
    { id: 1, name: 'TypeScript', category: 'Language' },
    { id: 2, name: 'Angular', category: 'Framework' },
    { id: 3, name: 'ng-zorro-antd', category: 'UI Library' },
    { id: 4, name: 'RxJS', category: 'Library' },
    { id: 5, name: 'Node.js', category: 'Runtime' },
    { id: 6, name: 'PostgreSQL', category: 'Database' },
  ];

  onSelectionChanged( items: Array<DemoItem> ): void {
    this.log = [`[selection] ${items.map( i => i.name ).join( ', ' ) || '(none)'}`, ...this.log.slice( 0, 19 )];
  }

  onItemDblClicked( item: DemoItem ): void {
    this.log = [`[dblclick] ${item.name}`, ...this.log.slice( 0, 19 )];
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { faPlus, faTrash, faEdit, faDownload } from '@fortawesome/free-solid-svg-icons';
import {
  ActionBarContent,
  ActionBar as CKActionBarComponent,
  LayoutContent,
} from '@local/ck-gen';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

interface DemoItem {
  id: number;
  name: string;
}

@Component( {
  selector: 'app-action-bar-demo',
  imports: [CommonModule, FormsModule, LayoutContent, CKActionBarComponent, NzSwitchModule],
  templateUrl: './action-bar-demo.html',
  styleUrl: './action-bar-demo.less'
} )
export class ActionBarDemo {
  hasSelection = false;
  selectedCount = 2;

  actions: ActionBarContent<DemoItem> = {
    left: [
      {
        name: 'create',
        displayName: 'Create',
        icon: faPlus,
        isDanger: false,
        shouldBeDisplayed: () => true,
        execute: () => alert( 'Create clicked!' )
      },
      {
        name: 'export',
        displayName: 'Export',
        icon: faDownload,
        isDanger: false,
        shouldBeDisplayed: () => true,
        execute: () => alert( 'Export clicked!' )
      }
    ],
    right: [
      {
        name: 'edit',
        displayName: 'Edit',
        icon: faEdit,
        isDanger: false,
        shouldBeDisplayed: () => this.hasSelection,
        execute: () => alert( 'Edit clicked!' )
      },
      {
        name: 'delete',
        displayName: 'Delete',
        icon: faTrash,
        isDanger: true,
        shouldBeDisplayed: () => this.hasSelection,
        execute: () => alert( 'Delete clicked!' )
      },
      {
        name: 'disabled-action',
        displayName: 'Disabled',
        isDanger: false,
        shouldBeDisplayed: () => true,
        shouldBeDisabled: () => true,
        execute: () => { }
      }
    ]
  };
}

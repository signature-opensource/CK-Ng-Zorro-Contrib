import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActionBarContent,
  ActionBar as CKActionBarComponent,
  LayoutContent,
} from '@local/ck-gen';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component( {
  selector: 'app-action-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutContent,
    CKActionBarComponent,
    NzDividerModule
  ],
  templateUrl: './action-bar.html',
  styleUrl: './action-bar.less',
} )
export class ActionBar {
  actions: ActionBarContent<ActionBarData>;

  constructor() {
    this.actions = { left: [], right: [] };

    this.actions.left.push( {
      displayName: 'Action Left 1',
      execute: () => alert( 'Left 1 clicked !' ),
      isDanger: false,
      name: 'left',
      shouldBeDisplayed: () => true,
    } );

    this.actions.right.push( {
      displayName: 'Action Right 1',
      execute: () => alert( 'Right 1 clicked !' ),
      isDanger: true,
      name: 'right',
      shouldBeDisplayed: () => true,
    } );

    this.actions.right.push( {
      displayName: 'Disabled',
      execute: () => { },
      isDanger: true,
      name: 'right',
      shouldBeDisplayed: () => true,
      shouldBeDisabled: () => true
    } );
  }
}

interface ActionBarData { }

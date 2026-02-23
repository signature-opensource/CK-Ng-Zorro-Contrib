import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ActionBarContent, Filter, LayoutContent, SwitchFilter } from '@local/ck-gen';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component( {
  selector: 'app-layout-content-demo',
  imports: [CommonModule, FormsModule, LayoutContent, NzSwitchModule, NzInputModule],
  templateUrl: './layout-content-demo.html',
  styleUrl: './layout-content-demo.less'
} )
export class LayoutContentDemo {
  headerTitle = 'LayoutContent';
  showFilters = true;

  filters: Array<Filter<unknown>> = [
    new SwitchFilter( 'Active only', true, false, '' )
  ];

  actions: ActionBarContent<unknown> = {
    left: [],
    right: [
      { name: 'add', displayName: 'Add', icon: faPlus, isDanger: false, shouldBeDisplayed: () => true, execute: () => alert( 'Add clicked' ) }
    ]
  };

  applyFilters( _filters: Array<Filter<unknown>> ): void {
    alert( 'Filters applied!' );
  }

  clearFilters(): void {
    alert( 'Filters cleared!' );
  }
}

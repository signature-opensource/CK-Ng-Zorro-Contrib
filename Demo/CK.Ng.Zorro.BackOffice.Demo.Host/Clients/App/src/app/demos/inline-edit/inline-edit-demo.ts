import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InlineEdit, LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-inline-edit-demo',
  imports: [CommonModule, LayoutContent, InlineEdit],
  templateUrl: './inline-edit-demo.html',
  styleUrl: './inline-edit-demo.less'
} )
export class InlineEditDemo {
  value1 = 'Click me to edit';
  value2 = 'Double-click me';
  value3 = '';

  log: Array<string> = [];

  onConfirmed( label: string, value: string ): void {
    this.log = [`[confirmed] ${label}: "${value}"`, ...this.log.slice( 0, 19 )];
  }

  onCancelled( label: string ): void {
    this.log = [`[cancelled] ${label}`, ...this.log.slice( 0, 19 )];
  }
}

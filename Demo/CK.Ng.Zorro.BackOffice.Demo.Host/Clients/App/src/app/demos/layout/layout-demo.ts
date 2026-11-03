import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-layout-demo',
  imports: [CommonModule, LayoutContent],
  templateUrl: './layout-demo.html',
  styleUrl: './layout-demo.less'
} )
export class LayoutDemo {
}

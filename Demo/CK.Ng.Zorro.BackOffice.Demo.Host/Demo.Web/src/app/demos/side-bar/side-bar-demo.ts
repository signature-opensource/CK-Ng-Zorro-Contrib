import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-side-bar-demo',
  imports: [CommonModule, LayoutContent],
  templateUrl: './side-bar-demo.html',
  styleUrl: './side-bar-demo.less'
} )
export class SideBarDemo {
}

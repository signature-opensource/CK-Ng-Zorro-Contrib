import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-top-bar-demo',
  imports: [CommonModule, LayoutContent],
  templateUrl: './top-bar-demo.html',
  styleUrl: './top-bar-demo.less'
} )
export class TopBarDemo {
}

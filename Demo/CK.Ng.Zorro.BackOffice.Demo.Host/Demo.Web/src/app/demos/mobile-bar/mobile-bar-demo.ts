import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-mobile-bar-demo',
  imports: [CommonModule, LayoutContent],
  templateUrl: './mobile-bar-demo.html',
  styleUrl: './mobile-bar-demo.less'
} )
export class MobileBarDemo {
}

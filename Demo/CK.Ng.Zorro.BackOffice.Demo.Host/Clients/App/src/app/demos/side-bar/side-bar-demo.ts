
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-side-bar-demo',
  imports: [LayoutContent],
  templateUrl: './side-bar-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './side-bar-demo.less'
} )
export class SideBarDemo {
}

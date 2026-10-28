
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-top-bar-demo',
  imports: [LayoutContent],
  templateUrl: './top-bar-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './top-bar-demo.less'
} )
export class TopBarDemo {
}

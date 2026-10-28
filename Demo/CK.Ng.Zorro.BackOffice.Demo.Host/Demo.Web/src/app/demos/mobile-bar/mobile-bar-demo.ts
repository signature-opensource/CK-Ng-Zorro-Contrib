
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-mobile-bar-demo',
  imports: [LayoutContent],
  templateUrl: './mobile-bar-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './mobile-bar-demo.less'
} )
export class MobileBarDemo {
}

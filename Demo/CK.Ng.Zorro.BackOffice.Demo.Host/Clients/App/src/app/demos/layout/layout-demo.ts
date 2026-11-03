
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-layout-demo',
  imports: [LayoutContent],
  templateUrl: './layout-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './layout-demo.less'
} )
export class LayoutDemo {
}

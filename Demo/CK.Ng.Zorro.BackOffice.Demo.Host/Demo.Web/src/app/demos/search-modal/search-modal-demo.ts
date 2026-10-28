
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-search-modal-demo',
  imports: [LayoutContent],
  templateUrl: './search-modal-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './search-modal-demo.less'
} )
export class SearchModalDemo {
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-search-modal-demo',
  imports: [CommonModule, LayoutContent],
  templateUrl: './search-modal-demo.html',
  styleUrl: './search-modal-demo.less'
} )
export class SearchModalDemo {
}

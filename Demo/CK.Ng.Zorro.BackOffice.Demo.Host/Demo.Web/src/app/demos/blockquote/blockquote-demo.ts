
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Blockquote, LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-blockquote-demo',
  imports: [LayoutContent, Blockquote],
  templateUrl: './blockquote-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './blockquote-demo.less'
} )
export class BlockquoteDemo {
}

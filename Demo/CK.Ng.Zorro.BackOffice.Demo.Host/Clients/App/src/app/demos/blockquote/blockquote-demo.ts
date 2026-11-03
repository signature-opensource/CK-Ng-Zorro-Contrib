import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Blockquote, LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-blockquote-demo',
  imports: [CommonModule, LayoutContent, Blockquote],
  templateUrl: './blockquote-demo.html',
  styleUrl: './blockquote-demo.less'
} )
export class BlockquoteDemo {
}

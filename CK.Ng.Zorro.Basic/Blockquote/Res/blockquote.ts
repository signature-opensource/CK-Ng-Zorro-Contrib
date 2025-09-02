import { Component, HostBinding, input } from '@angular/core';

@Component( {
  selector: 'ck-blockquote',
  imports: [],
    templateUrl: './blockquote.html',
    host: { 'class': 'ck-blockquote' }
} )
export class BlockquoteComponent {
    message = input.required<string>();
}

import { Component, HostBinding, input } from '@angular/core';

@Component( {
  selector: 'ck-blockquote',
  imports: [],
  templateUrl: './blockquote.component.html'
} )
export class BlockquoteComponent {
    @HostBinding( 'class' ) class = 'ck-blockquote';

    message = input.required<string>();
}

import { Component, input } from '@angular/core';

@Component( {
  selector: 'ck-blockquote',
  imports: [],
    templateUrl: './blockquote.html',
    host: { 'class': 'ck-blockquote' }
} )
export class Blockquote {
    message = input.required<string>();
}

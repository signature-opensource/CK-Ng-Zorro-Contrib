import { Component, input } from '@angular/core';

@Component( {
  selector: 'ck-simple-info-box',
  imports: [],
  templateUrl: './simple-info-box.html',
  host: { 'class': 'ck-simple-info-box' }
} )
export class SimpleInfoBox {
  label = input.required<string>();
  value = input.required<string | number>();
}

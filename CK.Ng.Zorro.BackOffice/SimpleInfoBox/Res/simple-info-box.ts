import { Component, input, HostBinding } from '@angular/core';

@Component( {
  selector: 'ck-simple-info-box',
  imports: [],
  templateUrl: './simple-info-box.html',
  host: { 'class': 'ck-simple-info-box' }
} )
export class SimpleInfoBoxComponent {
  label = input.required<string>();
  value = input.required<string | number>();
}

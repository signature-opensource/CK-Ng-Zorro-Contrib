import { Component, input, HostBinding } from '@angular/core';

@Component( {
  selector: 'ck-simple-info-box',
  imports: [],
  templateUrl: './simple-info-box.component.html',
} )
export class SimpleInfoBoxComponent {
  @HostBinding( 'class' ) class = 'ck-simple-info-box';

  label = input.required<string>();
  value = input.required<string | number>();
}

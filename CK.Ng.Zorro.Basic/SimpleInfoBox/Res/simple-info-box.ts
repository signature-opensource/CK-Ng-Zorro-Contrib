import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component( {
  selector: 'ck-simple-info-box',
  imports: [FontAwesomeModule],
  templateUrl: './simple-info-box.html',
  host: {
    'class': 'ck-simple-info-box',
    '[class.with-icon]': 'icon()',
    '[style.--ck-info-box-color]': 'color()'
  }
} )
export class SimpleInfoBox {
  label = input.required<string>();
  value = input.required<string | number>();
  icon = input<IconDefinition>();
  color = input<string>();
  subtitle = input<string>();
}

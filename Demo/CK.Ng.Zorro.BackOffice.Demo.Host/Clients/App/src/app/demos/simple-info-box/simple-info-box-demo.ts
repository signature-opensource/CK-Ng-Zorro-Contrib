import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SimpleInfoBox, LayoutContent } from '@local/ck-gen';
import { faUsers, faBolt, faCircleCheck, faChartLine, faPercent, faBoxes } from '@fortawesome/free-solid-svg-icons';

@Component( {
  selector: 'app-simple-info-box-demo',
  imports: [CommonModule, LayoutContent, SimpleInfoBox],
  templateUrl: './simple-info-box-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './simple-info-box-demo.less'
} )
export class SimpleInfoBoxDemo {
  readonly usersIcon = faUsers;
  readonly boltIcon = faBolt;
  readonly checkIcon = faCircleCheck;
  readonly chartIcon = faChartLine;
  readonly percentIcon = faPercent;
  readonly boxesIcon = faBoxes;
}

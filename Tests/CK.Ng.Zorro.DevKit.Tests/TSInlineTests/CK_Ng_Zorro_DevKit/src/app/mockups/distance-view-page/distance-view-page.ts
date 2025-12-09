import {Component} from '@angular/core';
import {NzIconDirective, provideNzIconsPatch} from 'ng-zorro-antd/icon';
import {PlayCircleOutline} from '@ant-design/icons-angular/icons';
import {NzStatisticComponent} from 'ng-zorro-antd/statistic';
import {NzTypographyComponent} from 'ng-zorro-antd/typography';

const icons = [
  PlayCircleOutline
]

@Component({
  selector: 'distance-view-page',
  imports: [NzIconDirective, NzStatisticComponent, NzTypographyComponent],
  providers: [provideNzIconsPatch(icons)],
  templateUrl: './distance-view-page.html',
  styleUrl: './distance-view-page.less'
})
export class DistanceViewPage {}

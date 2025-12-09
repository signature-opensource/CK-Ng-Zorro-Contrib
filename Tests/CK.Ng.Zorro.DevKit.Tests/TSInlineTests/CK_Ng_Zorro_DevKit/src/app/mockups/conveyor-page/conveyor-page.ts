import {Component} from '@angular/core';
import {NzIconDirective, provideNzIconsPatch} from 'ng-zorro-antd/icon';
import {
  ApiFill,
  FlagFill,
  HomeFill, MessageOutline, PlayCircleOutline,
  SettingFill,
  SettingOutline,
  TruckOutline,
  UserOutline
} from '@ant-design/icons-angular/icons';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzTypographyComponent} from 'ng-zorro-antd/typography';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzProgressComponent} from 'ng-zorro-antd/progress';
import {NzStatisticComponent} from 'ng-zorro-antd/statistic';
import {NzAlertComponent} from 'ng-zorro-antd/alert';
import {NgOptimizedImage} from '@angular/common';
import {NzBadgeComponent} from 'ng-zorro-antd/badge';

const icons = [
  ApiFill, FlagFill, HomeFill, SettingFill,
  UserOutline, SettingOutline, TruckOutline, PlayCircleOutline, MessageOutline
];

@Component({
  selector: 'conveyor-page',
  imports: [NzAvatarComponent, NzTypographyComponent, NzButtonComponent, NzIconDirective, NzCardComponent, NzProgressComponent, NzStatisticComponent, NgOptimizedImage, NzBadgeComponent],
  providers: [provideNzIconsPatch(icons)],
  templateUrl: './conveyor-page.html',
  styleUrl: './conveyor-page.less'
})
export class ConveyorPage {
}

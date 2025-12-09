import {Component} from '@angular/core';
import {NzIconDirective, provideNzIconsPatch} from 'ng-zorro-antd/icon';
import {
  ApiFill, BarcodeOutline, DoubleRightOutline,
  FlagFill,
  HomeFill, MessageOutline, PlayCircleOutline,
  SettingFill,
  SettingOutline,
  TruckOutline,
  UserOutline, WarningOutline
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
  BarcodeOutline, UserOutline, WarningOutline, DoubleRightOutline
];

@Component({
  selector: 'conveyor-page',
  imports: [NzAvatarComponent, NzTypographyComponent, NzButtonComponent, NzIconDirective, NzCardComponent, NzProgressComponent, NzStatisticComponent, NgOptimizedImage],
  providers: [provideNzIconsPatch(icons)],
  templateUrl: './picking-page.html',
  styleUrl: './picking-page.less'
})
export class PickingPage {
}

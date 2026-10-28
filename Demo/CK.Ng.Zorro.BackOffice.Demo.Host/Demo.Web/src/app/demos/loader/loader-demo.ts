
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Loader, LayoutContent } from '@local/ck-gen';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component( {
  selector: 'app-loader-demo',
  imports: [LayoutContent, Loader, NzButtonModule],
  templateUrl: './loader-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './loader-demo.less'
} )
export class LoaderDemo {
  isLoading = false;

  toggleLoading(): void {
    this.isLoading = !this.isLoading;
  }
}

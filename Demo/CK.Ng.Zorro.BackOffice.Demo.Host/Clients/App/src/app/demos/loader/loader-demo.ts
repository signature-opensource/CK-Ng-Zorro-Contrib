import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Loader, LayoutContent } from '@local/ck-gen';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component( {
  selector: 'app-loader-demo',
  imports: [CommonModule, LayoutContent, Loader, NzButtonModule],
  templateUrl: './loader-demo.html',
  styleUrl: './loader-demo.less'
} )
export class LoaderDemo {
  isLoading = false;

  toggleLoading(): void {
    this.isLoading = !this.isLoading;
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { faHome, faFolder, faFile } from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb, BreadcrumbItem, LayoutContent } from '@local/ck-gen';

@Component( {
  selector: 'app-breadcrumb-demo',
  imports: [CommonModule, LayoutContent, Breadcrumb],
  templateUrl: './breadcrumb-demo.html',
  styleUrl: './breadcrumb-demo.less'
} )
export class BreadcrumbDemo {
  log: Array<string> = [];

  basicItems: Array<BreadcrumbItem> = [
    { name: 'Home', onClick: () => this.onNav( 'Home' ) },
    { name: 'Projects', onClick: () => this.onNav( 'Projects' ) },
    { name: 'Alpha', onClick: () => this.onNav( 'Alpha' ) },
    { name: 'Settings' },
  ];

  iconItems: Array<BreadcrumbItem> = [
    { name: 'Home', icon: faHome, onClick: () => this.onNav( 'Home' ) },
    { name: 'Documents', icon: faFolder, onClick: () => this.onNav( 'Documents' ) },
    { name: 'Report.pdf', icon: faFile },
  ];

  longItems: Array<BreadcrumbItem> = [
    { name: 'Root', onClick: () => this.onNav( 'Root' ) },
    { name: 'Level 1', onClick: () => this.onNav( 'Level 1' ) },
    { name: 'Level 2', onClick: () => this.onNav( 'Level 2' ) },
    { name: 'Level 3', onClick: () => this.onNav( 'Level 3' ) },
    { name: 'Level 4', onClick: () => this.onNav( 'Level 4' ) },
    { name: 'Current Page' },
  ];

  onNav( name: string ): void {
    this.log = [`[click] ${name}`, ...this.log.slice( 0, 19 )];
  }

  onItemClicked( item: BreadcrumbItem ): void {
    this.log = [`[navItemClicked] ${item.name}`, ...this.log.slice( 0, 19 )];
  }
}

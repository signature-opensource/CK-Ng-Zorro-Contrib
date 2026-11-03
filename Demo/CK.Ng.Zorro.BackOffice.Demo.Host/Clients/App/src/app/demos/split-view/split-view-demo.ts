import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SplitView, LayoutContent } from '@local/ck-gen';

interface DemoItem {
  id: number;
  name: string;
  description: string;
}

@Component( {
  selector: 'app-split-view-demo',
  imports: [CommonModule, LayoutContent, SplitView],
  templateUrl: './split-view-demo.html',
  styleUrl: './split-view-demo.less'
} )
export class SplitViewDemo {
  detailVisible = false;
  selectedItem: DemoItem | null = null;

  items: Array<DemoItem> = [
    { id: 1, name: 'Project Alpha', description: 'A full-stack web application with real-time collaboration features.' },
    { id: 2, name: 'Project Beta', description: 'Mobile-first dashboard for monitoring IoT devices.' },
    { id: 3, name: 'Project Gamma', description: 'API gateway service with rate limiting and authentication.' },
    { id: 4, name: 'Project Delta', description: 'Machine learning pipeline for predictive analytics.' },
    { id: 5, name: 'Project Epsilon', description: 'Design system and component library for enterprise applications.' },
  ];

  selectItem( item: DemoItem ): void {
    this.selectedItem = item;
    this.detailVisible = true;
  }

  onDetailClosed(): void {
    this.selectedItem = null;
  }
}

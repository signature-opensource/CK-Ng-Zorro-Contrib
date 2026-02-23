import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveDirective } from '@local/ck-gen';

@Component( {
    selector: 'ck-split-view',
    templateUrl: './split-view.html',
    imports: [CommonModule, ResponsiveDirective],
    host: { 'class': 'ck-split-view' }
} )
export class SplitView {
    breakpoint = input<string>( '1025px' );
    sidebarWidth = input<string>( '350px' );
    detailVisible = model<boolean>( false );

    detailClosed = output<void>();

    closeDetail(): void {
        this.detailVisible.set( false );
        this.detailClosed.emit();
    }
}

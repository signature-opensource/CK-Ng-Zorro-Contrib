import { ChangeDetectionStrategy, Component, input, output, ViewEncapsulation, HostBinding, inject } from '@angular/core';

import { BreadcrumbItem } from './breadcrumb-item-model';
import { Breadcrumb } from './breadcrumb-model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component( {
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    selector: 'ck-breadcrumb-item',
    exportAs: 'BreadcrumbItem',
    templateUrl: './breadcrumb-item.html',
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        NzDropDownModule,
    ]
} )
export class CKBreadcrumbItem {
    @HostBinding( 'class' ) class = 'ck-breadcrumb-item';

    item = input.required<BreadcrumbItem>();
    isLast = input<boolean>( false );
    navItemClicked = output<BreadcrumbItem>();

    readonly breadcrumb = inject( Breadcrumb );

    itemClicked( item: BreadcrumbItem ): void {
        if ( !item.disabled ) {
            item.onClick?.();
            this.navItemClicked.emit( item );
        }
    }
}

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    ElementRef,
    inject,
    input,
    output,
    Renderer2,
    ViewEncapsulation,
} from '@angular/core';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { BreadcrumbItem } from './breadcrumb-item-model';
import { BreadcrumbBase } from './breadcrumb-model'; // Useless ???
import { BreadcrumbItemShowPipe } from './breadcrumb-item-show-pipe';
import { CKBreadcrumbItem } from './breadcrumb-item';

@Component( {
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    selector: 'ck-backoffice-breadcrumb',
    templateUrl: './breadcrumb.html',
    imports: [CommonModule, FormsModule, BreadcrumbItemShowPipe, CKBreadcrumbItem],
    providers: [{ provide: Breadcrumb, useExisting: Breadcrumb }],
} )
export class Breadcrumb implements BreadcrumbBase {
    @HostBinding( 'class' ) class = 'ck-backoffice-breadcrumb';

    separator = input<IconDefinition>( faChevronRight );
    breadcrumbItems = input<Array<BreadcrumbItem>>( [] );
    minItemsShow = input<number>();
    navItemClicked = output<BreadcrumbItem>();

    dir: Direction = 'ltr';

    #cdr = inject( ChangeDetectorRef );
    #elementRef = inject( ElementRef );
    #renderer = inject( Renderer2 );
    #directionality = inject( Directionality, { optional: true } );

    constructor () {
        if ( this.#directionality ) {
            this.#directionality.change?.pipe( takeUntilDestroyed() ).subscribe( ( direction: Direction ) => {
                this.dir = direction;
                this.prepareComponentForRtl();
                this.#cdr.detectChanges();
            } );

            this.dir = this.#directionality.value;
        }
        this.prepareComponentForRtl();
    }

    private prepareComponentForRtl(): void {
        if ( this.dir === 'rtl' ) {
            this.#renderer.addClass( this.#elementRef.nativeElement, 'ant-breadcrumb-rtl' );
        } else {
            this.#renderer.removeClass( this.#elementRef.nativeElement, 'ant-breadcrumb-rtl' );
        }
    }

    itemClicked( item: BreadcrumbItem ): void {
        this.navItemClicked.emit( item );
    }
}

import { Component, HostBinding, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ck-loader',
    templateUrl: './loader.html',
    imports: [CommonModule]
})
export class LoaderComponent {
    @HostBinding( 'class' ) class = 'ck-loader';

    isLoading = input<boolean>( false );
}

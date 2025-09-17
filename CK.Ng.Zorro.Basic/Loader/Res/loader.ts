import { Component, HostBinding, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ck-loader',
    templateUrl: './loader.html',
    imports: [CommonModule]
})
export class Loader {
    @HostBinding( 'class' ) class = 'ck-loader';

    isLoading = input<boolean>( false );
}

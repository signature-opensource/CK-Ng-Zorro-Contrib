import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ck-loader',
    templateUrl: './loader.html',
    imports: [CommonModule],
    host: { 'class': 'ck-loader', '[style.display]': 'isLoading() ? null : "none"' }
})
export class Loader {
    isLoading = input<boolean>( false );
}

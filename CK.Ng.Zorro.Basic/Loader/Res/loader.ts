import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ck-loader',
    templateUrl: './loader.html',
    imports: [CommonModule],
    host: { 'class': 'ck-loader' }
})
export class Loader {
    isLoading = input<boolean>( false );
}

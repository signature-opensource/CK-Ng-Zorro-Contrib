import { Pipe, type PipeTransform } from '@angular/core';
import { BreadcrumbItem } from './models/breadcrumb-item.model';

@Pipe({
    name: 'ckBreadcrumbItemShow'
})
export class BreadcrumbItemShowPipe implements PipeTransform {
    transform(value?: BreadcrumbItem[], minItemShow?: number): BreadcrumbItem[] {
        return !!value ? value.slice(-(minItemShow ?? value.length)) : [];
    }
}

import { InputSignal } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/**
 * https://angular.io/errors/NG3003
 * An intermediate interface for {@link BreadcrumbComponent} and {@link BreadcrumbItemComponent}
 *
 * Doesn't seem useful!!!
 */
export abstract class Breadcrumb {
    abstract separator: InputSignal<IconDefinition>;
}

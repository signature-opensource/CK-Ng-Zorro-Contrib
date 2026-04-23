import { InputSignal } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export abstract class BreadcrumbBase {
    abstract separator: InputSignal<IconDefinition>;
}

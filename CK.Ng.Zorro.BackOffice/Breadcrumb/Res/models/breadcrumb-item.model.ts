import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface BreadcrumbItem {
    name: string;
    icon?: IconDefinition;
    onClick?: () => void;
    children?: Array<BreadcrumbItem>;
    disabled?: boolean;
}

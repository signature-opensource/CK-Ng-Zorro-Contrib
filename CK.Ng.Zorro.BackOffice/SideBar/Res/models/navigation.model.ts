import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface NavigationSection {
    sectionHeadline: string;
    items: Array<NavigationItem>;
    bottom: boolean;
}

export interface NavigationItem {
    label: string;
    icon?: IconDefinition;
    routerLink?: string;
    isActive?: boolean;
    disabled?: boolean;
}

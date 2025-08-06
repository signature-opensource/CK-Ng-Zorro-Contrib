import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface TableAction<T> {
    name: string;
    icon: IconDefinition;
    isDanger: boolean;
    type: 'primary' | 'dashed' | 'link' | 'text' | 'default';
    displayedName?: string;
    tooltip?: string;
    execute: (item: T) => void;
    shouldBeDisplayed: (item: T) => boolean;
}

import { TemplateRef } from "@angular/core";

export enum FilterType {
    SELECT,
    SWITCH,
    DATE,
}

export interface Filter<T> {
    filterType: FilterType;
    label: string;
    value: T | Array<T> | undefined;
    active: boolean;
    placeholder?: string;
}

export class SwitchFilter implements Filter<boolean> {
    filterType: FilterType;
    label: string;
    value: boolean;
    active: boolean;
    placeholder?: string;

    constructor(
        label: string,
        defaultValue: boolean,
        active: boolean,
        placeholder?: string
    ) {
        this.filterType = FilterType.SWITCH;
        this.label = label;
        this.value = defaultValue;
        this.active = active;
        this.placeholder = placeholder;
    }
}

export class SelectFilter<T> implements Filter<T> {
    filterType: FilterType = FilterType.SELECT;
    label: string;
    mode: 'default' | 'multiple' | 'tags';
    options: Array<{ label: string; value: T }>;
    value: T | Array<T> | undefined;
    active: boolean;
    defaultValue?: T | Array<T>;
    placeholder?: string;
    maxSelectionCount: number;
    maxDisplayedCount: number;
    maxDisplayedTemplate?: TemplateRef<{ $implicit: unknown[] }>;

    constructor(
        mode: 'default' | 'multiple' | 'tags',
        label: string,
        options: Array<{ label: string; value: T }>,
        defaultValue?: T | Array<T>,
        active?: boolean,
        placeholder?: string,
        maxSelectionCount?: number,
        maxDisplayedCount?: number,
        maxDisplayedTemplate?: TemplateRef<{ $implicit: unknown[] }> ) {
        this.mode = mode;
        this.label = label;
        this.options = options;
        this.defaultValue = defaultValue;
        this.active = active ?? true;
        this.value = defaultValue;
        this.placeholder = placeholder;
        this.maxSelectionCount = maxSelectionCount ?? options.length;
        this.maxDisplayedCount = maxDisplayedCount ?? options.length;
        this.maxDisplayedTemplate = maxDisplayedTemplate;
    }
}

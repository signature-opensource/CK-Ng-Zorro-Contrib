import { TemplateRef } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface TableCellStyle {
    [cssProperty: string]: string | number;
}

export interface TableCellContext<T> {
    $implicit: T[keyof T];
    row: T;
}

export interface TableColumn<T> {
    name: keyof T;
    displayedName: string;
    hidden: boolean;
    showInMobile: boolean;
    sortable: boolean;
    iconShouldReplaceValue?: boolean;
    filter?: ColumnFilter<T>;
    sortOrder?: NzTableSortOrder | null;
    sortDirections?: Array<string | null>;
    sortFn?: NzTableSortFn<T>;
    valueFormatter?: ( value: T[keyof T], row: T ) => string;
    template?: TemplateRef<TableCellContext<T>>;
    defineIcon?: ( value: T[keyof T] ) => IconDefinition;
    style?: ( (value: T) => TableCellStyle ) | TableCellStyle;
}

export class CKTableColumn<T> implements TableColumn<T> {
    name: keyof T;
    displayedName: string;
    hidden: boolean;
    showInMobile: boolean;
    sortable: boolean;
    filter?: ColumnFilter<T>;
    sortOrder?: NzTableSortOrder;
    sortDirections?: (string | null)[];
    iconShouldReplaceValue: boolean = false;
    sortFn?: NzTableSortFn<T>;
    valueFormatter?: ( value: T[keyof T], row: T ) => string;
    template?: TemplateRef<TableCellContext<T>>;
    defineIcon?: ( value: T[keyof T] ) => IconDefinition;
    style?: ( ( value: T ) => TableCellStyle ) | TableCellStyle;

    constructor( name: keyof T,
                 displayedName: string,
                 hidden: boolean = false,
                 showInMobile: boolean = false,
                 sortable: boolean = false,
                 filter?: ColumnFilter<T>,
                 sortOrder?: NzTableSortOrder,
                 sortDirections?: ( string | null )[],
                 iconShouldReplaceValue: boolean = false,
                 sortFn?: NzTableSortFn<T>,
                 valueFormatter?: ( value: T[keyof T], row: T ) => string,
                 template?: TemplateRef<TableCellContext<T>>,
                 defineIcon?: ( value: T[keyof T] ) => IconDefinition,
                 style?: ( ( value: T ) => TableCellStyle ) | TableCellStyle )
    {
        this.name = name;
        this.displayedName = displayedName;
        this.hidden = hidden;
        this.showInMobile = showInMobile;
        this.filter = filter;
        this.sortable = sortable;
        this.sortOrder = sortOrder;
        this.sortDirections = sortDirections;
        this.sortFn = sortFn;
        this.iconShouldReplaceValue = iconShouldReplaceValue ?? false;
        this.valueFormatter = valueFormatter;
        this.template = template;
        this.defineIcon = defineIcon;
        this.style = style;
    }
}

export interface ColumnFilter<T> {
    visible: boolean;
    searchValue: string;
    search: (value: string) => void;
    reset: () => void;
}

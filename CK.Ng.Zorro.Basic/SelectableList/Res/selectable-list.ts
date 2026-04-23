import { Component, computed, input, model, output, TemplateRef } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';

@Component( {
    selector: 'ck-selectable-list',
    templateUrl: './selectable-list.html',
    imports: [CommonModule, NgTemplateOutlet, NzListModule],
    host: { 'class': 'ck-selectable-list' }
} )
export class SelectableList<T> {
    items = input.required<Array<T>>();
    itemUniqueKey = input.required<keyof T>();
    itemTemplateRef = input.required<TemplateRef<{ $implicit: T; selected: boolean }>>();
    multiSelect = input<boolean>( false );

    selectedItems = model<Array<T>>( [] );

    selectionChanged = output<Array<T>>();
    itemDblClicked = output<T>();

    selectedKeys = computed( () => {
        const key = this.itemUniqueKey();
        return new Set( this.selectedItems().map( i => i[key] ) );
    } );

    isSelected( item: T ): boolean {
        return this.selectedKeys().has( item[this.itemUniqueKey()] );
    }

    toggleSelection( item: T ): void {
        const key = this.itemUniqueKey();
        if ( this.isSelected( item ) ) {
            this.selectedItems.set( this.selectedItems().filter( i => i[key] !== item[key] ) );
        } else {
            if ( this.multiSelect() ) {
                this.selectedItems.set( [...this.selectedItems(), item] );
            } else {
                this.selectedItems.set( [item] );
            }
        }
        this.selectionChanged.emit( this.selectedItems() );
    }

    onDblClick( item: T ): void {
        this.itemDblClicked.emit( item );
    }
}

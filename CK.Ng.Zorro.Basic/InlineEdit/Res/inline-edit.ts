import { Component, ElementRef, input, model, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component( {
    selector: 'ck-inline-edit',
    templateUrl: './inline-edit.html',
    imports: [CommonModule, FormsModule, NzInputModule],
    host: { 'class': 'ck-inline-edit' }
} )
export class InlineEdit {
    value = model<string>( '' );
    placeholder = input<string>( '' );
    editOnDblClick = input<boolean>( false );

    confirmed = output<string>();
    cancelled = output<void>();

    editing = signal( false );
    editValue = signal( '' );
    inputElement = viewChild<ElementRef>( 'editInput' );

    startEdit(): void {
        this.editValue.set( this.value() );
        this.editing.set( true );
        setTimeout( () => this.inputElement()?.nativeElement.focus() );
    }

    confirm(): void {
        this.value.set( this.editValue() );
        this.editing.set( false );
        this.confirmed.emit( this.editValue() );
    }

    cancel(): void {
        this.editing.set( false );
        this.cancelled.emit();
    }

    onKeydown( event: KeyboardEvent ): void {
        if ( event.key === 'Enter' ) {
            this.confirm();
        } else if ( event.key === 'Escape' ) {
            this.cancel();
        }
    }

    onClick(): void {
        if ( !this.editOnDblClick() ) {
            this.startEdit();
        }
    }

    onDblClick(): void {
        if ( this.editOnDblClick() ) {
            this.startEdit();
        }
    }
}

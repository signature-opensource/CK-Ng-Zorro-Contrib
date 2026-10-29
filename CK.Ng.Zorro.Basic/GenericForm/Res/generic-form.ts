import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, HostListener, inject, Injector, input, OnInit, output, Signal, signal } from '@angular/core';
import { FieldState, FieldTree, FormField, FormRoot, SchemaFn } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';

import { GenericField, GenericFields, GenericFormHandle, genericForm } from './generic-form-fields';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormLayoutType, NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

interface GenericFormRow {
  readonly key: string;
  readonly def: GenericField<any>;
  readonly field: FieldTree<unknown>;
}

/**
 * Renders the fields of a {@link GenericFormHandle}: a label, the input bound with `[formField]`
 * and the rule messages (translation keys) once the field is touched or dirty.
 * Opened as modal content with `NZ_MODAL_DATA` `{ fields, rules? }` and no `form` input, it builds
 * its own form; modal callers read it from {@link GenericForm.handle}.
 */
@Component( {
  selector: 'ck-generic-form',
  imports: [NgTemplateOutlet, FormField, FormRoot, TranslatePipe, NzCheckboxModule, NzDatePickerModule, NzFormModule, NzInputModule, NzSelectModule],
  templateUrl: './generic-form.html'
} )
export class GenericForm implements OnInit {
  form = input<GenericFormHandle<GenericFields>>();
  formLayout = input<NzFormLayoutType>( 'vertical' );
  appearance = input<'labelled' | 'compact'>( 'labelled' );
  errorDisplay = input<'text' | 'tip'>( 'text' );
  /** Enter typed inside the form, outside a modal. In a modal, Enter triggers the modal OK instead. */
  submitRequested = output<void>();

  readonly #modalData = inject<{ fields?: GenericFields, rules?: SchemaFn<any> } | null>( NZ_MODAL_DATA, { optional: true } );
  readonly #modalRef = inject( NzModalRef, { optional: true } );
  readonly #injector = inject( Injector );
  readonly #built = signal<GenericFormHandle<GenericFields> | undefined>( undefined );

  /** The bound `form` input, or the form built from the modal data. */
  readonly handle: Signal<GenericFormHandle<GenericFields> | undefined> = computed( () => this.form() ?? this.#built() );

  protected readonly rows = computed<GenericFormRow[]>( () => {
    const h = this.handle();
    if( !h ) {
      return [];
    }
    const fields = h.fields();
    const tree = h.form as unknown as Record<string, FieldTree<unknown>>;
    return Object.keys( fields ).map( key => ( { key, def: fields[key], field: tree[key] } ) );
  } );

  ngOnInit(): void {
    // Inputs are not set yet in the constructor; from ngOnInit on, an undefined form input means none is bound.
    const data = this.#modalData;
    if( !this.form() && data?.fields ) {
      const fields = data.fields;
      this.#built.set( genericForm( () => fields, { rules: data.rules, injector: this.#injector } ) );
    }
  }

  // An Enter already handled by a control (nz-select opening or picking an option) is not a submit.
  @HostListener( 'keydown.enter', ['$event'] )
  protected onEnter( event: Event ): void {
    if( event.defaultPrevented ) {
      return;
    }
    event.preventDefault();
    if( this.#modalRef ) {
      this.#modalRef.triggerOk();
    } else {
      this.submitRequested.emit();
    }
  }

  protected revealed( state: FieldState<unknown> ): boolean {
    return state.touched() || state.dirty();
  }

  protected showErrors( state: FieldState<unknown> ): boolean {
    return this.revealed( state ) && state.invalid();
  }

  protected messagesOf( state: FieldState<unknown> ): string[] {
    return state.errors().map( e => e.message ).filter( ( m ): m is string => !!m );
  }

  protected asText( field: FieldTree<unknown> ): FieldTree<string> {
    return field as FieldTree<string>;
  }

  protected asNumber( field: FieldTree<unknown> ): FieldTree<number | null> {
    return field as FieldTree<number | null>;
  }
}

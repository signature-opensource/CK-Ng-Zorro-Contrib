import { TemplateRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { required, validate } from '@angular/forms/signals';
import { genericForm, numberField, selectField, textField } from '@local/ck-gen';

describe( 'genericForm', () => {

  function build<T>( create: () => T ): T {
    return TestBed.runInInjectionContext( create );
  }

  it( 'model starts from each field\'s default', () => {
    const h = build( () => genericForm( () => ( { t: textField( 'L', 'a' ), n: numberField( 'N', 3 ) } ) ) );
    expect( h.model() ).toEqual( { t: 'a', n: 3 } );
    const text: string = h.model().t;
    // @ts-expect-error a text field's value is a string, never a number
    const wrong: number = h.model().t;
    expect( [text, wrong] ).toEqual( ['a', 'a'] );
  } );

  it( 'a rule\'s message is the field error', () => {
    const h = build( () => genericForm( () => ( {
      t: textField( 'L', '', { rules: p => required( p, { message: 'K.Required' } ) } )
    } ) ) );
    expect( h.form.t().errors()[0]?.message ).toBe( 'K.Required' );
    expect( h.form().valid() ).toBe( false );
  } );

  it( 'an empty-string select default counts as missing', () => {
    const h = build( () => genericForm( () => ( {
      s: selectField( 'S', '', { options: [{ label: 'P', value: '' }, { label: 'A', value: 'a' }], rules: p => required( p ) } )
    } ) ) );
    expect( h.form().valid() ).toBe( false );
  } );

  it( 'an emptied number is null and fails required', () => {
    const h = build( () => genericForm( () => ( { n: numberField( 'N', 3, { rules: p => required( p ) } ) } ) ) );
    expect( h.form().valid() ).toBe( true );
    h.form.n().value.set( null );
    expect( h.model().n ).toBeNull();
    expect( h.form().valid() ).toBe( false );
  } );

  it( 'a hidden field does not block validity', () => {
    const h = build( () => genericForm( () => ( {
      other: textField( 'O' ),
      t: textField( 'L', '', { rules: p => required( p ), show: m => m['other'] === 'x' } )
    } ) ) );
    expect( h.form.t().hidden() ).toBe( true );
    expect( h.form().valid() ).toBe( true );
    h.form.other().value.set( 'x' );
    expect( h.form.t().hidden() ).toBe( false );
    expect( h.form().valid() ).toBe( false );
  } );

  it( 'disabled true disables the field', () => {
    const h = build( () => genericForm( () => ( { t: textField( 'L', '', { disabled: true } ) } ) ) );
    expect( h.form.t().disabled() ).toBe( true );
  } );

  it( 'a disabled function follows the signals it reads', () => {
    const locked = signal( false );
    const h = build( () => genericForm( () => ( { t: textField( 'L', '', { disabled: () => locked() } ) } ) ) );
    expect( h.form.t().disabled() ).toBe( false );
    locked.set( true );
    expect( h.form.t().disabled() ).toBe( true );
  } );

  it( 'root rules see every field', () => {
    const h = build( () => genericForm( () => ( { a: textField( 'A', 'x' ), b: textField( 'B', 'x' ) } ), {
      rules: p => validate( p.b, ( { value, valueOf } ) => value() === valueOf( p.a ) ? { kind: 'same', message: 'K.Same' } : undefined )
    } ) );
    expect( h.form.b().errors()[0]?.message ).toBe( 'K.Same' );
    h.form.b().value.set( 'y' );
    expect( h.form.b().errors() ).toEqual( [] );
  } );

  it( 'reset puts back the current defaults and clears dirty', () => {
    const initial = signal( 'a' );
    const h = build( () => genericForm( () => ( { t: textField( 'L', initial() ) } ) ) );
    h.form.t().value.set( 'edited' );
    h.form.t().markAsDirty();
    initial.set( 'b' );
    h.reset();
    expect( h.model().t ).toBe( 'b' );
    expect( h.form().dirty() ).toBe( false );
  } );

  it( 'fields are re-read for display', () => {
    const optionTemplate = signal<TemplateRef<unknown> | undefined>( undefined );
    const h = build( () => genericForm( () => ( {
      s: selectField( 'S', 'a', { options: [{ label: 'A', value: 'a' }], selectOptionTemplate: optionTemplate() } )
    } ) ) );
    expect( h.fields().s.selectOptionTemplate ).toBeUndefined();
    const template = {} as TemplateRef<unknown>;
    optionTemplate.set( template );
    expect( h.fields().s.selectOptionTemplate ).toBe( template );
  } );
} );

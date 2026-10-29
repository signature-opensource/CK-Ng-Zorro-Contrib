import { Component, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { FormField, SchemaFn, minLength, required, validate } from '@angular/forms/signals';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CustomFieldContext, GenericFields, GenericForm, ModelOf, customField, genericForm, numberField, selectField, textField } from '@local/ck-gen';

let setup: { fields: () => GenericFields, rules?: SchemaFn<ModelOf<GenericFields>>, errorDisplay: 'text' | 'tip' };

@Component( {
  imports: [GenericForm],
  template: `<ck-generic-form [form]="handle" [errorDisplay]="errorDisplay" (submitRequested)="submitted = submitted + 1" />`
} )
class Host {
  readonly handle = genericForm( setup.fields, { rules: setup.rules } );
  readonly errorDisplay = setup.errorDisplay;
  submitted = 0;
}

@Component( {
  imports: [GenericForm, FormField],
  template: `
    <ck-generic-form [form]="handle" />
    <ng-template #input let-field><input class="custom-input" [formField]="field" /></ng-template>
    <ng-template #error let-field><span class="custom-error">{{ field().errors().length }}</span></ng-template>
    <ng-template #option let-option><span class="flag">{{ option.label }}</span></ng-template>`
} )
class TemplatesHost {
  readonly input = viewChild<TemplateRef<CustomFieldContext<string>>>( 'input' );
  readonly error = viewChild<TemplateRef<CustomFieldContext<string>>>( 'error' );
  readonly option = viewChild<TemplateRef<unknown>>( 'option' );
  readonly handle = genericForm( () => ( {
    c: customField( 'K.Custom', '', {
      template: this.input()!,
      rules: p => minLength( p, 3, { message: 'K.Short' } )
    } ),
    e: textField( 'K.Text', '', { errorTemplate: this.error(), rules: p => required( p, { message: 'K.Required' } ) } ),
    s: selectField( 'K.Lang', 'fr', { options: [{ label: 'K.Fr', value: 'fr' }, { label: 'K.En', value: 'en' }], selectOptionTemplate: this.option() } )
  } ) );
}

describe( 'GenericForm', () => {

  beforeEach( () => {
    TestBed.configureTestingModule( { providers: [provideTranslateService(), { provide: ComponentFixtureAutoDetect, useValue: true }] } );
  } );

  async function render( fields: () => GenericFields, rules?: SchemaFn<ModelOf<GenericFields>>, errorDisplay: 'text' | 'tip' = 'text' ): Promise<ComponentFixture<Host>> {
    setup = { fields, rules, errorDisplay };
    const fixture = TestBed.createComponent( Host );
    await fixture.whenStable();
    return fixture;
  }

  function all( fixture: ComponentFixture<unknown>, selector: string ): HTMLElement[] {
    return Array.from( ( fixture.nativeElement as HTMLElement ).querySelectorAll<HTMLElement>( selector ) );
  }

  function first( fixture: ComponentFixture<unknown>, selector: string ): HTMLElement {
    const e = ( fixture.nativeElement as HTMLElement ).querySelector<HTMLElement>( selector );
    if( !e ) throw new Error( `No element matches ${selector}.` );
    return e;
  }

  async function type( fixture: ComponentFixture<unknown>, input: HTMLInputElement, value: string ): Promise<void> {
    input.value = value;
    input.dispatchEvent( new Event( 'input' ) );
    input.dispatchEvent( new Event( 'blur' ) );
    await fixture.whenStable();
  }

  function enter( target: EventTarget ): void {
    target.dispatchEvent( new KeyboardEvent( 'keydown', { key: 'Enter', keyCode: 13, bubbles: true, cancelable: true } ) );
  }

  it( 'renders one item per visible field', async () => {
    const fixture = await render( () => ( {
      a: textField( 'K.A' ),
      b: textField( 'K.B' ),
      c: textField( 'K.C', '', { show: () => false } )
    } ) );
    expect( all( fixture, 'nz-form-item' ).length ).toBe( 2 );
    expect( all( fixture, 'nz-form-label' ).map( l => l.textContent?.trim() ) ).toEqual( ['K.A', 'K.B'] );
  } );

  it( 'shows the required mark from the rules, overridable', async () => {
    const fixture = await render( () => ( {
      a: textField( 'K.A', '', { rules: p => required( p ) } ),
      b: textField( 'K.B', '', { rules: p => required( p ), requiredMark: false } )
    } ) );
    const labels = all( fixture, 'nz-form-label label' );
    expect( labels.map( l => l.classList.contains( 'ant-form-item-required' ) ) ).toEqual( [true, false] );
  } );

  const shortField = () => ( { a: textField( 'K.A', 'x', { rules: p => minLength( p, 3, { message: 'K.Short' } ) } ) } );

  it( 'a field that already fails a rule shows no message before interaction', async () => {
    const fixture = await render( shortField );
    expect( fixture.componentInstance.handle.form().valid() ).toBe( false );
    expect( all( fixture, '.form-control-error' ) ).toEqual( [] );
  } );

  it( 'a rule message shows once the field is dirty, without a blur', async () => {
    const fixture = await render( shortField );
    const input = first( fixture, 'input' ) as HTMLInputElement;
    input.value = 'xy';
    input.dispatchEvent( new Event( 'input' ) );
    await fixture.whenStable();
    expect( all( fixture, '.form-control-error' ).map( e => e.textContent?.trim() ) ).toEqual( ['K.Short'] );
  } );

  it( 'label, placeholder, option label and rule message are translated', async () => {
    const translate = TestBed.inject( TranslateService );
    translate.setTranslation( 'en', { 'K.Name': 'Full name', 'K.Hint': 'Type a name', 'K.Lang': 'Language', 'K.Fr': 'French', 'K.Short': 'Too short' } );
    translate.use( 'en' );
    const fixture = await render( () => ( {
      a: textField( 'K.Name', 'x', { placeholder: 'K.Hint', rules: p => minLength( p, 3, { message: 'K.Short' } ) } ),
      s: selectField( 'K.Lang', 'fr', { options: [{ label: 'K.Fr', value: 'fr' }] } )
    } ) );
    await type( fixture, first( fixture, 'input' ) as HTMLInputElement, 'xy' );
    expect( all( fixture, 'nz-form-label' ).map( l => l.textContent?.trim() ) ).toEqual( ['Full name', 'Language'] );
    expect( ( first( fixture, 'input' ) as HTMLInputElement ).placeholder ).toBe( 'Type a name' );
    expect( first( fixture, '.ant-select-selection-item' ).textContent?.trim() ).toBe( 'French' );
    expect( all( fixture, '.form-control-error' ).map( e => e.textContent?.trim() ) ).toEqual( ['Too short'] );
  } );

  it( 'an error without a message renders nothing', async () => {
    const fixture = await render( () => ( { a: textField( 'K.A', 'x', { rules: p => required( p ) } ) } ) );
    await type( fixture, first( fixture, 'input' ) as HTMLInputElement, '' );
    expect( fixture.componentInstance.handle.form().valid() ).toBe( false );
    expect( all( fixture, '.form-control-error' ) ).toEqual( [] );
  } );

  it( 'root rule messages render at the top once the form is touched', async () => {
    const fixture = await render( () => ( { a: textField( 'K.A' ) } ),
                                  p => validate( p, () => ( { kind: 'root', message: 'K.Root' } ) ) );
    expect( all( fixture, '.errors.general-form' ) ).toEqual( [] );
    await type( fixture, first( fixture, 'input' ) as HTMLInputElement, 'x' );
    expect( all( fixture, '.errors.general-form .form-control-error' ).map( e => e.textContent?.trim() ) ).toEqual( ['K.Root'] );
  } );

  it( 'custom field renders its template with the field and keeps the label and messages', async () => {
    const fixture = TestBed.createComponent( TemplatesHost );
    await fixture.whenStable();
    expect( all( fixture, 'nz-form-label' )[0].textContent?.trim() ).toBe( 'K.Custom' );
    await type( fixture, first( fixture, 'input.custom-input' ) as HTMLInputElement, 'ab' );
    expect( fixture.componentInstance.handle.model().c ).toBe( 'ab' );
    const item = all( fixture, 'nz-form-item' )[0];
    expect( item.querySelector( '.form-control-error' )?.textContent?.trim() ).toBe( 'K.Short' );
  } );

  it( 'errorTemplate replaces the rule messages', async () => {
    const fixture = TestBed.createComponent( TemplatesHost );
    await fixture.whenStable();
    fixture.componentInstance.handle.form.e().markAsTouched();
    await fixture.whenStable();
    const item = all( fixture, 'nz-form-item' )[1];
    expect( item.querySelector( '.custom-error' )?.textContent?.trim() ).toBe( '1' );
    expect( item.querySelector( '.form-control-error' ) ).toBeNull();
  } );

  it( 'errorDisplay tip renders messages through nz-form-control', async () => {
    const fixture = await render( () => ( { a: textField( 'K.A', '', { rules: p => minLength( p, 3, { message: 'K.Short' } ) } ) } ),
                                  undefined,
                                  'tip' );
    await type( fixture, first( fixture, 'input' ) as HTMLInputElement, 'x' );
    expect( all( fixture, '.ant-form-item-explain-error' ).map( e => e.textContent?.trim() ) ).toEqual( ['K.Short'] );
    expect( all( fixture, '.form-control-error' ).filter( e => !e.closest( '.ant-form-item-explain-error' ) ) ).toEqual( [] );
  } );

  it( 'nz-select shows the bound value', async () => {
    const fixture = await render( () => ( {
      lang: selectField( 'K.Lang', 'fr', { options: [{ label: 'Français', value: 'fr' }, { label: 'English', value: 'en' }] } )
    } ) );
    expect( first( fixture, '.ant-select-selection-item' ).textContent?.trim() ).toBe( 'Français' );
  } );

  it( 'a select option template set after the first render is used by the options', async () => {
    const fixture = TestBed.createComponent( TemplatesHost );
    await fixture.whenStable();
    first( fixture, 'nz-select .ant-select-selector' ).click();
    await fixture.whenStable();
    const flags = Array.from( document.querySelectorAll( '.flag' ) ).map( e => e.textContent?.trim() );
    expect( flags ).toEqual( ['K.Fr', 'K.En'] );
  } );

  it( 'an emptied number input yields null', async () => {
    const fixture = await render( () => ( { n: numberField( 'K.N', 3 ) } ) );
    const input = first( fixture, 'input[type=number]' ) as HTMLInputElement;
    expect( input.value ).toBe( '3' );
    await type( fixture, input, '' );
    expect( fixture.componentInstance.handle.model()['n'] ).toBeNull();
  } );

  it( 'Enter inside the form emits submitRequested; Enter outside does not', async () => {
    const fixture = await render( () => ( { a: textField( 'K.A' ) } ) );
    enter( document.body );
    expect( fixture.componentInstance.submitted ).toBe( 0 );
    enter( first( fixture, 'input' ) );
    expect( fixture.componentInstance.submitted ).toBe( 1 );
  } );

  it( 'Enter that opens a select does not submit', async () => {
    const fixture = await render( () => ( {
      lang: selectField( 'K.Lang', 'fr', { options: [{ label: 'Français', value: 'fr' }] } )
    } ) );
    enter( first( fixture, 'nz-select input' ) );
    expect( fixture.componentInstance.submitted ).toBe( 0 );
  } );

  describe( 'in a modal', () => {

    const triggerOk = jest.fn();

    beforeEach( () => {
      triggerOk.mockReset();
      TestBed.configureTestingModule( {
        providers: [
          { provide: NZ_MODAL_DATA, useValue: { fields: { a: textField( 'K.A', 'start' ) } } },
          { provide: NzModalRef, useValue: { triggerOk } }
        ]
      } );
    } );

    async function open(): Promise<ComponentFixture<GenericForm>> {
      const fixture = TestBed.createComponent( GenericForm );
      await fixture.whenStable();
      return fixture;
    }

    it( 'builds its own form from NZ_MODAL_DATA', async () => {
      const fixture = await open();
      const handle = fixture.componentInstance.handle();
      expect( handle ).toBeDefined();
      await type( fixture, first( fixture, 'input' ) as HTMLInputElement, 'typed' );
      expect( handle!.model()['a'] ).toBe( 'typed' );
    } );

    it( 'two modal instances do not share values', async () => {
      const one = await open();
      await type( one, first( one, 'input' ) as HTMLInputElement, 'first' );
      const two = await open();
      expect( two.componentInstance.handle()!.model()['a'] ).toBe( 'start' );
      expect( ( first( two, 'input' ) as HTMLInputElement ).value ).toBe( 'start' );
    } );

    it( 'Enter triggers the modal OK', async () => {
      const fixture = await open();
      enter( first( fixture, 'input' ) );
      expect( triggerOk ).toHaveBeenCalledTimes( 1 );
    } );
  } );
} );

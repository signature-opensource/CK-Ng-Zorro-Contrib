import { Component, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { FormField, minLength, required } from '@angular/forms/signals';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CustomFieldContext, GenericFields, GenericForm, customField, dateField, genericForm, numberField, passwordField, selectField, textField } from '@local/ck-gen';

let setup: { fields: () => GenericFields };

// errorDisplay is bound to 'text' on purpose: compact shows tips whatever it says.
@Component( {
  imports: [GenericForm],
  template: `<ck-generic-form [form]="handle" appearance="compact" errorDisplay="text" />`
} )
class CompactHost {
  readonly handle = genericForm( setup.fields );
}

@Component( {
  imports: [GenericForm, FormField],
  template: `
    <ck-generic-form [form]="handle" appearance="compact" />
    <ng-template #input let-field><input class="custom-input" [formField]="field" /></ng-template>
    <ng-template #error let-field><span class="custom-error">{{ field().errors().length }}</span></ng-template>`
} )
class CompactTemplatesHost {
  readonly input = viewChild<TemplateRef<CustomFieldContext<string>>>( 'input' );
  readonly error = viewChild<TemplateRef<CustomFieldContext<string>>>( 'error' );
  readonly handle = genericForm( () => ( {
    c: customField( 'K.Custom', '', { template: this.input()!, rules: p => minLength( p, 3, { message: 'K.Short' } ) } ),
    e: textField( 'K.Text', '', { errorTemplate: this.error(), rules: p => required( p, { message: 'K.Required' } ) } )
  } ) );
}

@Component( {
  imports: [GenericForm, FormField, NzInputModule],
  template: `
    <ck-generic-form [form]="handle" appearance="compact" />
    <ng-template #input let-field><nz-input-wrapper><input nz-input class="wrapped" [formField]="field" /></nz-input-wrapper></ng-template>`
} )
class WrappedCustomHost {
  readonly input = viewChild<TemplateRef<CustomFieldContext<string>>>( 'input' );
  readonly handle = genericForm( () => ( {
    c: customField( 'K.Custom', '', { template: this.input()!, rules: p => minLength( p, 3, { message: 'K.Short' } ) } )
  } ) );
}

describe( 'GenericForm compact', () => {

  beforeEach( () => {
    TestBed.configureTestingModule( { providers: [provideTranslateService(), provideNzDateFnsAdapter(), { provide: ComponentFixtureAutoDetect, useValue: true }] } );
  } );

  async function render( fields: () => GenericFields ): Promise<ComponentFixture<CompactHost>> {
    setup = { fields };
    const fixture = TestBed.createComponent( CompactHost );
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

  function useEnglish( translations: Record<string, string> ): void {
    const translate = TestBed.inject( TranslateService );
    translate.setTranslation( 'en', translations );
    translate.use( 'en' );
  }

  const shortField = () => ( { a: textField( 'K.A', '', { rules: p => minLength( p, 3, { message: 'K.Short' } ) } ) } );

  it( 'renders no label: the placeholder, or the label when there is none, carries it', async () => {
    useEnglish( { 'K.Hint': 'Type a name', 'K.B': 'Bee' } );
    const fixture = await render( () => ( {
      a: textField( 'K.A', '', { placeholder: 'K.Hint' } ),
      b: textField( 'K.B' )
    } ) );
    expect( all( fixture, 'nz-form-label' ) ).toEqual( [] );
    expect( all( fixture, 'input' ).map( i => ( i as HTMLInputElement ).placeholder ) ).toEqual( ['Type a name', 'Bee'] );
  } );

  it( 'wraps text, password and number inputs with their prefix icon and keeps their input type', async () => {
    const fixture = await render( () => ( {
      t: textField( 'K.T', '', { prefixIcon: faEnvelope } ),
      p: passwordField( 'K.P', '', { prefixIcon: faEnvelope } ),
      n: numberField( 'K.N', 0, { prefixIcon: faEnvelope } )
    } ) );
    const wrappers = all( fixture, 'nz-input-wrapper' );
    expect( wrappers.length ).toBe( 3 );
    for( const wrapper of wrappers ) {
      expect( wrapper.querySelector( '.ant-input-prefix fa-icon[nzInputPrefix] svg' ) ).not.toBeNull();
      expect( wrapper.querySelector( 'input[nz-input]' ) ).not.toBeNull();
    }
    expect( wrappers.map( w => w.querySelector( 'input' )!.type ) ).toEqual( ['text', 'password', 'number'] );
  } );

  it( 'shows feedback and translated messages as error tips, whatever errorDisplay says', async () => {
    useEnglish( { 'K.Short': 'Too short' } );
    const fixture = await render( shortField );
    await type( fixture, first( fixture, 'input' ) as HTMLInputElement, 'x' );
    expect( first( fixture, 'nz-form-item' ).classList ).toContain( 'ant-form-item-has-feedback' );
    expect( all( fixture, '.ant-form-item-explain-error' ).map( e => e.textContent?.trim() ) ).toEqual( ['Too short'] );
    expect( all( fixture, '.errors' ) ).toEqual( [] );
  } );

  it( 'shows success feedback once a revealed error is corrected', async () => {
    const fixture = await render( shortField );
    const input = first( fixture, 'input' ) as HTMLInputElement;
    expect( first( fixture, 'nz-form-item' ).classList ).not.toContain( 'ant-form-item-has-success' );
    expect( all( fixture, 'nz-form-item-feedback-icon' ) ).toEqual( [] );
    await type( fixture, input, 'x' );
    expect( first( fixture, 'nz-form-item' ).classList ).not.toContain( 'ant-form-item-has-success' );
    await type( fixture, input, 'xyz' );
    expect( first( fixture, 'nz-form-item' ).classList ).toContain( 'ant-form-item-has-success' );
  } );

  it( 'inputs are large', async () => {
    const fixture = await render( () => ( {
      t: textField( 'K.T' ),
      p: passwordField( 'K.P' ),
      n: numberField( 'K.N' ),
      s: selectField( 'K.S', 'a', { options: [{ label: 'K.A', value: 'a' }] } ),
      d: dateField( 'K.D' )
    } ) );
    expect( all( fixture, 'input[nz-input]' ).map( i => i.classList.contains( 'ant-input-lg' ) ) ).toEqual( [true, true, true] );
    expect( first( fixture, 'nz-select' ).classList ).toContain( 'ant-select-lg' );
    expect( first( fixture, 'nz-date-picker' ).classList ).toContain( 'ant-picker-large' );
  } );

  it( 'renders the errorTemplate as the error tip', async () => {
    const fixture = TestBed.createComponent( CompactTemplatesHost );
    await fixture.whenStable();
    fixture.componentInstance.handle.form.e().markAsTouched();
    await fixture.whenStable();
    const item = all( fixture, 'nz-form-item' )[1];
    expect( item.querySelector( '.ant-form-item-explain-error .custom-error' )?.textContent?.trim() ).toBe( '1' );
  } );

  it( 'a custom field gets its messages as error tips, without a wrapper', async () => {
    const fixture = TestBed.createComponent( CompactTemplatesHost );
    await fixture.whenStable();
    await type( fixture, first( fixture, 'input.custom-input' ) as HTMLInputElement, 'ab' );
    const item = all( fixture, 'nz-form-item' )[0];
    expect( item.querySelector( 'nz-input-wrapper' ) ).toBeNull();
    expect( item.querySelector( '.ant-form-item-explain-error' )?.textContent?.trim() ).toBe( 'K.Short' );
    expect( item.querySelector( '.errors' ) ).toBeNull();
  } );

  it( 'an input a custom template wraps itself shows the error status and feedback icon until fixed, at its own size', async () => {
    const fixture = TestBed.createComponent( WrappedCustomHost );
    await fixture.whenStable();
    const input = first( fixture, 'input.wrapped' ) as HTMLInputElement;
    await type( fixture, input, 'ab' );
    expect( input.classList ).toContain( 'ant-input-status-error' );
    expect( input.classList ).not.toContain( 'ant-input-lg' );
    expect( all( fixture, 'nz-input-wrapper nz-form-item-feedback-icon.ant-form-item-feedback-icon-error' ).length ).toBe( 1 );
    await type( fixture, input, 'abc' );
    expect( input.classList ).not.toContain( 'ant-input-status-error' );
    expect( all( fixture, 'nz-input-wrapper nz-form-item-feedback-icon.ant-form-item-feedback-icon-error' ) ).toEqual( [] );
  } );
} );


import { Component, ChangeDetectionStrategy } from '@angular/core';
import { email, max, min, minLength, required } from '@angular/forms/signals';
import {
  GenericForm,
  LayoutContent,
  checkboxField,
  dateField,
  genericForm,
  numberField,
  passwordField,
  selectField,
  textField
} from '@local/ck-gen';
import { TranslatePipe } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component( {
  selector: 'app-generic-form-demo',
  imports: [LayoutContent, GenericForm, NzButtonModule, TranslatePipe],
  templateUrl: './generic-form-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './generic-form-demo.less'
} )
export class GenericFormDemo {
  // Labels, placeholders, option labels and messages are translation keys, defined in
  // CK.Ng.Zorro.BackOffice.Demo.App/Res/ts-locales.
  readonly form = genericForm( () => ( {
    username: textField( 'Demo.GenericForm.Username.Label', '', {
      placeholder: 'Demo.GenericForm.Username.Placeholder',
      rules: p => {
        required( p, { message: 'Demo.GenericForm.Username.Required' } );
        minLength( p, 3, { message: 'Demo.GenericForm.Username.MinLength' } );
      }
    } ),
    email: textField( 'Demo.GenericForm.Email.Label', '', {
      placeholder: 'Demo.GenericForm.Email.Placeholder',
      rules: p => {
        required( p, { message: 'Demo.GenericForm.Email.Required' } );
        email( p, { message: 'Demo.GenericForm.Email.Invalid' } );
      }
    } ),
    age: numberField( 'Demo.GenericForm.Age.Label', 18, {
      placeholder: 'Demo.GenericForm.Age.Placeholder',
      rules: p => {
        min( p, 1, { message: 'Demo.GenericForm.Age.Min' } );
        max( p, 150, { message: 'Demo.GenericForm.Age.Max' } );
      }
    } ),
    password: passwordField( 'Demo.GenericForm.Password.Label', '', {
      placeholder: 'Demo.GenericForm.Password.Placeholder',
      rules: p => {
        required( p, { message: 'Demo.GenericForm.Password.Required' } );
        minLength( p, 6, { message: 'Demo.GenericForm.Password.MinLength' } );
      }
    } ),
    role: selectField( 'Demo.GenericForm.Role.Label', 'viewer', {
      placeholder: 'Demo.GenericForm.Role.Placeholder',
      rules: p => required( p, { message: 'Demo.GenericForm.Role.Required' } ),
      options: [
        { label: 'Demo.GenericForm.Role.Admin', value: 'admin' },
        { label: 'Demo.GenericForm.Role.Editor', value: 'editor' },
        { label: 'Demo.GenericForm.Role.Viewer', value: 'viewer' },
      ]
    } ),
    birthDate: dateField( 'Demo.GenericForm.BirthDate.Label', new Date(), { placeholder: 'Demo.GenericForm.BirthDate.Placeholder' } ),
    newsletter: checkboxField( 'Demo.GenericForm.Newsletter.Label' )
  } ) );

  formSubmitted = false;

  onSubmit(): void {
    this.formSubmitted = true;
    setTimeout( () => this.formSubmitted = false, 3000 );
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  FormControlConfig,
  GenericForm,
  GenericFormData,
  IFormControlConfig,
  LayoutContent
} from '@local/ck-gen';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface MyFormValues {
  username: string;
  email: string;
  age: number;
  password: string;
  role: string;
  birthDate: Date;
  newsletter: boolean;
}

@Component( {
  selector: 'app-generic-form-demo',
  imports: [CommonModule, LayoutContent, GenericForm, NzButtonModule],
  templateUrl: './generic-form-demo.html',
  styleUrl: './generic-form-demo.less'
} )
export class GenericFormDemo {
  formData: GenericFormData<unknown, unknown> = {
    formControls: this.buildFormControls() as { [key: string]: IFormControlConfig<unknown, unknown> }
  };

  formSubmitted = false;

  buildFormControls(): { [key: string]: IFormControlConfig<unknown, MyFormValues> } {
    const username = new FormControlConfig<string, MyFormValues>( 'text', 'Username', '', {
      placeholder: 'Enter your username',
      required: true,
      validators: [Validators.required, Validators.minLength( 3 )],
      errorMessages: { required: 'Username is required', minlength: 'Min 3 characters' }
    } );

    const email = new FormControlConfig<string, MyFormValues>( 'text', 'Email', '', {
      placeholder: 'user@example.com',
      required: true,
      validators: [Validators.required, Validators.email],
      errorMessages: { required: 'Email is required', email: 'Invalid email format' }
    } );

    const age = new FormControlConfig<number, MyFormValues>( 'number', 'Age', 18, {
      placeholder: 'Your age',
      validators: [Validators.min( 1 ), Validators.max( 150 )],
      errorMessages: { min: 'Must be at least 1', max: 'Must be at most 150' }
    } );

    const password = new FormControlConfig<string, MyFormValues>( 'password', 'Password', '', {
      placeholder: 'Enter password',
      required: true,
      validators: [Validators.required, Validators.minLength( 6 )],
      errorMessages: { required: 'Password is required', minlength: 'Min 6 characters' }
    } );

    const role = new FormControlConfig<string, MyFormValues>( 'select', 'Role', 'viewer', {
      placeholder: 'Select a role',
      required: true,
      validators: [Validators.required],
      errorMessages: { required: 'Please select a role' },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ]
    } );

    const birthDate = new FormControlConfig<Date, MyFormValues>( 'date', 'Birth Date', new Date(), {
      placeholder: 'Select date'
    } );

    const newsletter = new FormControlConfig<boolean, MyFormValues>( 'checkbox', 'Subscribe to newsletter', false );

    return { username, email, age, password, role, birthDate, newsletter };
  }

  onSubmit(): void {
    this.formSubmitted = true;
    setTimeout( () => this.formSubmitted = false, 3000 );
  }
}

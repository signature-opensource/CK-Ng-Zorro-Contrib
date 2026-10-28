import { Injector, Signal, TemplateRef, WritableSignal, computed, signal, untracked } from '@angular/core';
import { FieldTree, SchemaFn, SchemaPath, apply, disabled, form, hidden } from '@angular/forms/signals';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type FieldType = 'text' | 'number' | 'date' | 'password' | 'select' | 'checkbox' | 'custom';

export interface FieldOption<T> { label: string; value: T; disabled?: boolean }

export interface CustomFieldContext<T> { $implicit: FieldTree<T>; field: FieldTree<T> }

export interface GenericField<T> {
  readonly type: FieldType;
  readonly label: string;
  readonly defaultValue: T;
  readonly placeholder?: string;
  readonly rules?: SchemaFn<T>;
  readonly show?: ( model: Record<string, unknown> ) => boolean;
  readonly disabled?: boolean | ( () => boolean );
  readonly requiredMark?: boolean;
  readonly prefixIcon?: IconDefinition;
  readonly autocomplete?: string;
  readonly options?: ReadonlyArray<FieldOption<unknown>>;
  readonly selectOptionTemplate?: TemplateRef<unknown>;
  readonly selectMode?: 'multiple' | 'tags' | 'default';
  readonly dateFormat?: string;
  readonly template?: TemplateRef<CustomFieldContext<T>>;
  readonly errorTemplate?: TemplateRef<CustomFieldContext<T>>;
}

export type GenericFields = Record<string, GenericField<any>>;

export type ModelOf<F extends GenericFields> = { [K in keyof F]: F[K] extends GenericField<infer T> ? T : never };

export type FieldOpts<T> = Partial<Omit<GenericField<T>, 'type' | 'label' | 'defaultValue' | 'options' | 'template'>>;

export interface GenericFormHandle<F extends GenericFields> {
  readonly fields: Signal<F>;
  readonly model: WritableSignal<ModelOf<F>>;
  readonly form: FieldTree<ModelOf<F>>;
  /** Puts back each field's current default, then clears touched and dirty. */
  reset(): void;
}

export function textField( label: string, defaultValue: string = '', o?: FieldOpts<string> ): GenericField<string> {
  return { ...o, type: 'text', label, defaultValue };
}

export function passwordField( label: string, defaultValue: string = '', o?: FieldOpts<string> ): GenericField<string> {
  return { ...o, type: 'password', label, defaultValue };
}

export function numberField( label: string, defaultValue: number | null = null, o?: FieldOpts<number | null> ): GenericField<number | null> {
  return { ...o, type: 'number', label, defaultValue };
}

export function dateField( label: string, defaultValue: Date | null = null, o?: FieldOpts<Date | null> ): GenericField<Date | null> {
  return { ...o, type: 'date', label, defaultValue };
}

export function checkboxField( label: string, defaultValue: boolean = false, o?: FieldOpts<boolean> ): GenericField<boolean> {
  return { ...o, type: 'checkbox', label, defaultValue };
}

export function selectField<T>( label: string,
                                defaultValue: T,
                                o: FieldOpts<T> & { options: ReadonlyArray<FieldOption<T>> } ): GenericField<T> {
  return { ...o, type: 'select', label, defaultValue, selectMode: o.selectMode ?? 'default' };
}

export function customField<T>( label: string,
                                defaultValue: T,
                                o: FieldOpts<T> & { template: TemplateRef<CustomFieldContext<T>> } ): GenericField<T> {
  return { ...o, type: 'custom', label, defaultValue };
}

/**
 * Builds the model and the signal form of a set of field definitions. Call it once, in the
 * injection context of the component that owns the form: the form registers an effect there.
 * @param fields Re-read reactively for display properties, `show` and `disabled`; `reset()` reads the
 * defaults again. Its keys and each field's `rules` are read once, at creation, and must not change.
 * @param options Cross-field `rules` applied on the root after the field rules; `injector` and
 * `name` are passed to `form()`.
 */
export function genericForm<F extends GenericFields>( fields: () => F,
                                                      options?: { rules?: SchemaFn<ModelOf<F>>, injector?: Injector, name?: string } ): GenericFormHandle<F> {
  const current = computed( fields );
  const initial = untracked( current );
  const model = signal( defaultsOf( initial ) );
  const tree = form( model, p => {
    // The path tree of a generic ModelOf<F> has no string index signature (TS7053).
    const paths = p as unknown as Record<string, SchemaPath<unknown>>;
    for( const key of Object.keys( initial ) ) {
      const rules = initial[key].rules;
      if( rules ) {
        apply( paths[key], rules );
      }
      hidden( paths[key], () => {
        const show = current()[key].show;
        return show ? !show( model() ) : false;
      } );
      disabled( paths[key], () => {
        const d = current()[key].disabled;
        return typeof d === 'function' ? d() : d === true;
      } );
    }
    options?.rules?.( p );
  }, { injector: options?.injector, name: options?.name } );
  return {
    fields: current,
    model,
    form: tree,
    reset: () => {
      model.set( defaultsOf( untracked( current ) ) );
      tree().reset();
    }
  };
}

function defaultsOf<F extends GenericFields>( fields: F ): ModelOf<F> {
  return Object.fromEntries( Object.entries( fields ).map( ( [key, f] ) => [key, f.defaultValue] ) ) as ModelOf<F>;
}

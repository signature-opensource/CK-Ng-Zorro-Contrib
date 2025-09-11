import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ActionBarContent, DefaultTableColumn, Filter, FormControlConfig, GenericFormComponent, IFormControlConfig, LayoutContentComponent, SelectFilter, SwitchFilter, TableAction, TableColumn, TableComponent } from '@local/ck-gen';
import { TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';

import { ModalOptions, NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component( {
  selector: 'app-overview',
  imports: [
    CommonModule,
    FormsModule,
    LayoutContentComponent,
    TableComponent,
    NzModalModule,
    NzTabsModule,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.less'
} )
export class OverviewComponent {
  readonly #modal = inject( NzModalService );
  // readonly #notif = inject( NotificationService );
  readonly #translateService = inject( TranslateService );
  #allItems: Array<MyItem> = [];

  filters: Array<Filter<unknown>> = [
    new SwitchFilter( 'Affiché', true, false, '' ),
    new SelectFilter<MyTypeEnum>(
      'tags',
      'Type',
      [{ label: 'Type1', value: MyTypeEnum.Type1 }, { label: 'Type2', value: MyTypeEnum.Type2 }],
      [MyTypeEnum.Type1, MyTypeEnum.Type2],
      false,
      'Sélectionner les types à afficher'
    )
  ];

  items: Array<MyItem> = [
    {
      id: 1,
      label: 'Label #1',
      creationDate: this.randomDate( new Date( 2012, 0, 1 ), new Date() ),
      displayed: true,
      type: MyTypeEnum.Type2
    },
    {
      id: 2,
      label: 'Label #2',
      creationDate: this.randomDate( new Date( 2012, 0, 1 ), new Date() ),
      displayed: false,
      type: MyTypeEnum.Type1
    },
    {
      id: 3,
      label: 'Label #3',
      creationDate: this.randomDate( new Date( 2012, 0, 1 ), new Date() ),
      displayed: true,
      type: MyTypeEnum.Type1
    },
    {
      id: 4,
      label: 'Label #4',
      creationDate: this.randomDate( new Date( 2012, 0, 1 ), new Date() ),
      displayed: false,
      type: MyTypeEnum.Type2
    },
    {
      id: 5,
      label: 'Label #5',
      creationDate: this.randomDate( new Date( 2012, 0, 1 ), new Date() ),
      displayed: false,
      type: MyTypeEnum.Type2
    },
    {
      id: 6,
      label: 'Label #6',
      creationDate: this.randomDate( new Date( 2012, 0, 1 ), new Date() ),
      displayed: true,
      type: MyTypeEnum.Type1
    }
  ];

  columns: Array<TableColumn<MyItem>> = [
    {
      name: 'id',
      displayedName: '#',
      hidden: false,
      showInMobile: true,
      sortable: true,
      sortFn: ( a, b ) => {
        return a.id - b.id;
      }
    },
    {
      name: 'label',
      displayedName: 'Description',
      hidden: false,
      showInMobile: true,
      sortable: true,
      sortFn: ( a, b ) => {
        return a.label.localeCompare( b.label );
      }
    },
    {
      name: 'creationDate',
      displayedName: 'Date de création',
      hidden: false,
      showInMobile: true,
      sortable: true,
      sortFn: ( a, b ) => {
        const d = a.creationDate && a.creationDate !== null ? DateTime.fromISO( a.creationDate.toString() ) : this.getDefaultDateTime();
        const d1 = b.creationDate && a.creationDate !== null ? DateTime.fromISO( b.creationDate.toString() ) : this.getDefaultDateTime();
        return d.toMillis() - d1.toMillis();
      },
      valueFormatter: ( value: unknown, i: MyItem ) => {
        return i.creationDate.toLocaleString( DateTime.DATETIME_SHORT );
      }
    },
    {
      name: 'type',
      displayedName: 'Type',
      hidden: false,
      showInMobile: true,
      sortable: false,
    },
    new DefaultTableColumn(
      'displayed',
      'Affiché',
      false,
      true,
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      ( value: unknown, row: MyItem ) => {
        if ( value ) return 'Oui';
        return 'Non'
      }
    )
  ];

  actions: ActionBarContent<MyItem> = {
    left: [
    ],
    right: [
      {
        name: 'create',
        displayName: this.#translateService.instant( 'Button.Add' ),
        icon: faPlus,
        isDanger: false,
        shouldBeDisplayed: () => true,
        execute: () => {
          this.openAddModal();
        }
      }

    ]
  };

  constructor() {
    this.#allItems = [...this.items];
    this.applyFilters( this.filters );
  }

  openAddModal(): void {
    const form = this.generateMyItemForm();
    const opts: ModalOptions = {
      nzTitle: 'Ajouter un item',
      nzCancelText: 'Annuler',
      nzOkText: this.#translateService.instant( 'Button.Add' ),
      nzContent: GenericFormComponent,
      nzData: { formData: { formControls: form } },
      nzOnOk: async () => {
        const formComponent = modalRef.componentRef?.instance;
        if ( formComponent && formComponent.form.valid ) {
          try {
            const newItem = { id: formComponent.form.get( 'id' )!.value, label: formComponent.form.get( 'label' )!.value, creationDate: DateTime.now(), type: formComponent.form.get( 'type' )!.value, displayed: true };
            this.#allItems.push( newItem );
            this.items = [...this.#allItems];
            this.applyFilters( this.filters );

            // this.#notif.displaySimpleMessage( 'success', 'Item created' );
          } catch ( e ) {
            console.error( e );
            // this.#notif.displaySimpleMessage( 'error', 'Failed to create item' );
            return Promise.reject();
          }
        } else {
          return Promise.reject();
        }
      }
    };

    const modalRef = this.#modal.create( opts );
  }

  generateMyItemForm(): { [key: string]: IFormControlConfig<unknown, unknown> } {
    const computedId = this.#allItems.sort( ( a, b ) => a.id - b.id )[this.#allItems.length - 1].id;
    const id = new FormControlConfig( 'number', 'Identifiant', computedId + 1 );
    id.disabled = true;
    const label = new FormControlConfig( 'text', 'Label', `Label #${computedId + 1}`, {
      placeholder: 'Renseignez le label',
      required: true,
      validators: [Validators.required, Validators.minLength( 3 )],
      errorMessages: { 'required': 'Veuillez renseigner le label', 'minLength': 'Le label doit contenir au moins 3 caractères' }
    } );
    const type = new FormControlConfig( 'select', 'Type', MyTypeEnum.Type1, {
      placeholder: 'Sélectionnez le type',
      required: true,
      validators: [Validators.required],
      errorMessages: { 'required': 'Choisissez le type' },
      autocomplete: undefined,
      options: [{ label: 'Type1', value: MyTypeEnum.Type1 }, { label: 'Type2', value: MyTypeEnum.Type2 }]
    } );

    return { id, label, type };
  }

  applyFilters( filters: Array<Filter<unknown>> ): void {
    this.filters = [...filters];
    const activeFilters = filters.filter( f => f.active );
    if ( activeFilters.length === 0 ) {
      this.clearFilters();
    } else {
      let displayed: Array<MyItem> = [...this.#allItems];
      activeFilters.forEach( f => {
        if ( f.label === 'Affiché' ) {
          displayed = displayed.filter( i => i.displayed === f.value );
        }
        if ( f.label === 'Type' ) {
          displayed = displayed.filter( i => ( f.value as Array<MyTypeEnum> ).includes( i.type ) );
        }
      } );

      this.items = [...displayed];
    }
  }

  clearFilters(): void {
    this.items = [...this.#allItems];
  }

  randomDate( start: Date, end: Date ): DateTime {
    return DateTime.fromJSDate( new Date( start.getTime() + Math.random() * ( end.getTime() - start.getTime() ) ) );
  }

  getDefaultDateTime() {
    return DateTime.fromISO( '0001-01-01T00:00:00' );
  }

  totalCount(): number {
    return this.#allItems.length;
  }

  search( s: string ): void {
    this.applyFilters( this.filters );

    let displayed: Array<MyItem> = [...this.items];
    displayed = displayed.filter( i => i.label.toLocaleLowerCase().startsWith( s.toLocaleLowerCase() ) || i.label.toLocaleLowerCase().includes( s.toLocaleLowerCase() ) || i.id.toString() === s );

    this.items = [...displayed];
  }

  clearSearch(): void {
    this.applyFilters( this.filters );
  }
}

interface MyItem {
  id: number;
  label: string;
  creationDate: DateTime;
  type: MyTypeEnum,
  displayed: boolean;
}

enum MyTypeEnum {
  Type1,
  Type2
} 
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, effect, EffectRef, ElementRef, inject, input, linkedSignal, OnDestroy, output, Signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, fromEvent } from 'rxjs';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component( {
  selector: 'ck-search-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, NzInputModule, NzToolTipModule, NgTemplateOutlet],
  templateUrl: './search-modal.component.html'
} )
export class SearchModalComponent implements OnDestroy {
  readonly #modal = inject( NzModalRef );
  readonly #nzData = inject( NZ_MODAL_DATA );

  inputElement: Signal<ElementRef | undefined> = viewChild( 'input' );

  placeholder: Signal<string | undefined> = input<string>();
  inputDebounceTime: Signal<number | undefined> = input<number>();
  defaultContentTpl = input<TemplateRef<unknown>>();
  searchResultTpl = input<TemplateRef<unknown>>();

  searchRequested = output<string>();
  searchCleared = output<void>();

  readonly searchIcon = faSearch;
  readonly closeIcon = faClose;
  readonly arrowIcon = faArrowRight;

  #effectRef?: EffectRef;
  inputPlaceholder = linkedSignal( () => this.placeholder() );
  debounceTime = linkedSignal( () => this.inputDebounceTime() ?? 300 );
  defaultContentTemplate = linkedSignal( () => this.defaultContentTpl() );
  searchResultTemplate = linkedSignal( () => this.searchResultTpl() );
  searchString: string = '';

  constructor() {
    if ( !this.inputPlaceholder() && this.#nzData.placeholder.length > 0 ) {
      this.inputPlaceholder.set( this.#nzData.placeholder );
    }

    if ( !this.inputDebounceTime() && this.#nzData.inputDebounceTime ) {
      this.debounceTime.set( this.#nzData.inputDebounceTime );
    }

    if ( !this.defaultContentTpl() && this.#nzData.defaultContentTpl ) {
      this.defaultContentTemplate.set( this.#nzData.defaultContentTpl );
    }

    if ( !this.searchResultTpl() && this.#nzData.searchResultTpl ) {
      this.searchResultTemplate.set( this.#nzData.searchResultTpl );
    }

    afterNextRender( () => {
      if ( this.inputElement() ) {
        setTimeout( () => {
          this.inputElement()!.nativeElement.focus();
        }, 250 );
      }
    } );

    const destroy$ = takeUntilDestroyed();

    this.#effectRef = effect( () => {
      const inputElement = this.inputElement()?.nativeElement;
      if ( !inputElement ) return;

      fromEvent( inputElement, 'input' )
        .pipe(
          debounceTime( this.debounceTime() ),
          destroy$
        )
        .subscribe( _ => {
          this.handleInputChange();
        } );
    }, { manualCleanup: true } );
  }

  handleInputChange(): void {
    if ( this.searchString === '' ) {
      this.clearSearch();
    } else {
      this.searchRequested.emit( this.searchString );
    }
  }

  clearSearch(): void {
    this.searchString = '';
    this.searchCleared.emit();
  }

  closeModal(): void {
    this.#modal.close();
  }

  ngOnDestroy(): void {
    if ( this.#effectRef ) {
      this.#effectRef.destroy();
    }
  }
}

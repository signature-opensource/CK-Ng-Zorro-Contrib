import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, Subject } from 'rxjs';

export interface SearchDebouncer {
  debouncing: boolean;
  subject: Subject<string>;
  onInputChange( term: string ): void;
}

export function createSearchDebouncer(
  debounceMs: number,
  destroyRef: DestroyRef,
  onSearch: ( term: string ) => void
): SearchDebouncer {
  const debouncer: SearchDebouncer = {
    debouncing: false,
    subject: new Subject<string>(),
    onInputChange( term: string ) {
      debouncer.debouncing = true;
      debouncer.subject.next( term );
    }
  };

  debouncer.subject
    .pipe( debounceTime( debounceMs ), takeUntilDestroyed( destroyRef ) )
    .subscribe( ( term: string ) => {
      if ( debouncer.debouncing ) {
        debouncer.debouncing = false;
        onSearch( term );
      }
    } );

  return debouncer;
}

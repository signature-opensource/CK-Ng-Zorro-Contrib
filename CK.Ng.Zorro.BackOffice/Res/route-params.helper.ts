import { toSignal } from '@angular/core/rxjs-interop';
import { Signal, assertInInjectionContext, inject } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { map } from "rxjs";

export function injectNumberRouteParam( key: string ): Signal<number> {
    assertInInjectionContext( injectNumberRouteParam );
    const route = inject( ActivatedRoute );
    const getParam = ( params: Params ): number => key ? parseInt( params?.[key] ) ?? null : 0;

    return toSignal<number>( route.params.pipe( map( getParam ) ), { requireSync: true } );
}

export function injectStringRouteParam( key: string ): Signal<string> {
    assertInInjectionContext( injectStringRouteParam );
    const route = inject( ActivatedRoute );
    const getParam = ( params: Params ): string => key ? params?.[key] ?? null : '';

    return toSignal<string>( route.params.pipe( map( getParam ) ), { requireSync: true } );
}
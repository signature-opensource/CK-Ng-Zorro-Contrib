import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { CKGenAppModule } from '@local/ck-gen/CK/Angular/CKGenAppModule';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection( { eventCoalescing: true } ),
    provideRouter( routes, withHashLocation() ),
    ...CKGenAppModule.Providers,
    provideAnimations()
  ],
};
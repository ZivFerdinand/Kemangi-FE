import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { basicAuthInterceptor } from './core/helpers/basic-auth.interceptor';
import { errorInterceptor } from './core/helpers/error.interceptor';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { NgxUiLoaderModule, POSITION } from 'ngx-ui-loader';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'id' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideAnimations(),
    provideAnimationsAsync(),

    importProvidersFrom(
      NgxUiLoaderModule.forRoot({
        fgsColor: 'rgba(255,255,255,0)',
        bgsPosition: POSITION.bottomCenter,
      }),
    ),
    provideToastr({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      closeButton: false,
      preventDuplicates: true,
    }),
    provideHttpClient(
      withInterceptors([basicAuthInterceptor, errorInterceptor]),
    ),
  ],
};

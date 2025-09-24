import {
  ApplicationConfig,
  APP_INITIALIZER,
  importProvidersFrom,
} from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { loadingInterceptor } from './core/interceptor/loading.interceptor';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { securityInterceptor } from './core/interceptor/security.interceptor';
import { headerInterceptor } from './core/interceptor/header.interceptor';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { GlobalTranslateService } from './core/service/global-translate.service';
import { SharedService } from './core/service/shared.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { errorInterceptor } from './core/interceptor/error.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/',
    `.json?v=${Date.now()}`
  );
}

export function initLanguage(
  globalTranslateService: GlobalTranslateService
): () => void {
  return () => globalTranslateService.initializeLanguage();
}
export function initApp(sharedService: SharedService): () => Promise<any> {
  return () => firstValueFrom(sharedService.checkApiStatus());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),

    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loadingInterceptor,
        authInterceptor,
        securityInterceptor,
        headerInterceptor,
        errorInterceptor,
      ])
    ),
    importProvidersFrom(
      CarouselModule,
      NgxSpinnerModule,
      TooltipModule.forRoot(),
      TranslateModule.forRoot({
        defaultLanguage: 'ar',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initLanguage,
      deps: [GlobalTranslateService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SharedService],
      multi: true,
    },
  ],
};

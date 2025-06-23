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

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// هنا بنضيف الـ APP_INITIALIZER
export function initLanguage(
  globalTranslateService: GlobalTranslateService
): () => void {
  return () => globalTranslateService.initializeLanguage();
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
  ],
};

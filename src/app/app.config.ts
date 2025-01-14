import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { loadingInterceptor } from './core/interceptor/loading.interceptor';
import { authInterceptor } from './core/interceptor/auth.interceptor';

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
      withInterceptors([loadingInterceptor, authInterceptor])
    ),
    importProvidersFrom(CarouselModule),
  ],
};

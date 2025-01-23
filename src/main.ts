import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { firstValueFrom } from 'rxjs';
import { SharedService } from './app/core/service/shared.service';

const initializeLanguage = () => {
  const lang = localStorage.getItem('lang') || 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.classList.add(`lang-${lang}`);
};

const bootstrap = async () => {
  initializeLanguage();
  const app = await bootstrapApplication(AppComponent, appConfig);
  const sharedService = app.injector.get(SharedService);
  await firstValueFrom(sharedService.checkApiStatus());
  return app;
};

bootstrap().catch((err) => console.error(err));

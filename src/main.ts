import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const initializeLanguage = () => {
  const lang = localStorage.getItem('lang') || 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.classList.add(`lang-${lang}`);
};

initializeLanguage();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

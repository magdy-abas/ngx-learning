import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { firstValueFrom } from 'rxjs';
import { SharedService } from './app/core/service/shared.service';

const bootstrap = async () => {
  const app = await bootstrapApplication(AppComponent, appConfig);

  const sharedService = app.injector.get(SharedService);
  await firstValueFrom(sharedService.checkApiStatus());

  return app;
};

bootstrap().catch((err) => console.error(err));

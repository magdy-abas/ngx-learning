import {
  mergeApplicationConfig,
  ApplicationConfig,
  InjectionToken,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

export const HOSTNAME = new InjectionToken<string>('HOSTNAME');

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: HOSTNAME,
      useFactory: () => {
        const host = (global as any)?.process?.env?.HOSTNAME_OVERRIDE;
        return host || 'localhost';
      },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

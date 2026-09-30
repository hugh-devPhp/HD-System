import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { HTTP_TRANSFER_CACHE_ORIGIN_MAP } from '@angular/common/http';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { SERVER_API_URL } from './services/api-url.token';
import { environment } from '../environments/environment';

const internalApiUrl = process.env['API_INTERNAL_URL'];

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    ...(internalApiUrl
      ? [
          { provide: SERVER_API_URL, useValue: internalApiUrl },
          // Lets the browser reuse responses fetched by the server from the internal URL
          {
            provide: HTTP_TRANSFER_CACHE_ORIGIN_MAP,
            useValue: { [new URL(internalApiUrl).origin]: new URL(environment.apiUrl).origin },
          },
        ]
      : []),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

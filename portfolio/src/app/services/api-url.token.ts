import { InjectionToken } from '@angular/core';

/**
 * Base URL used to reach the API during server-side rendering.
 * Only provided on the server (see app.config.server.ts): inside Docker the
 * public URL (localhost:8000) does not point to the API container.
 */
export const SERVER_API_URL = new InjectionToken<string>('SERVER_API_URL');

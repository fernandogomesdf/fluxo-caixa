import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, ErrorHandler, Injectable } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

@Injectable()
class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Suprimir erros específicos do ResizeObserver que são inofensivos
    if (error?.message?.includes('ResizeObserver loop completed with undelivered notifications')) {
      return; // Ignorar este erro específico
    }
    
    // Para outros erros, fazer log normal
    console.error('Global error handler:', error);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};

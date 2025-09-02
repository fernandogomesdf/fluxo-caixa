import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Suprimir erro comum do ResizeObserver que não afeta funcionalidade
const resizeObserverErrorHandler = (e: ErrorEvent) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.preventDefault();
    return false;
  }
  return true;
};

window.addEventListener('error', resizeObserverErrorHandler);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

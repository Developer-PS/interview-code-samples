import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes, TemplatePageTitleStrategy } from './app.routes';
//import { provideMatomo, withRouter } from 'ngx-matomo-client';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: TitleStrategy,
      // Will tell Angular DI to inject our TemplatePageTitleStrategy class when TitleStrategy is requested
      useClass: TemplatePageTitleStrategy,
    },
    provideHttpClient(),
    provideAnimationsAsync(),
    //provideMatomo({
    //  trackerUrl: 'https://matomo.mega-prism.com/',
    //  siteId: '1',
    //  enableLinkTracking: false,
    //  requireConsent: "cookie"
    //}, withRouter()),
    provideAnimationsAsync()
  ],
};

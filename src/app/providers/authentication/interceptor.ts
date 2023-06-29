import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { AuthenticationProvider } from './authentication';
import { UrlProvider } from '../url/url';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private platform: Platform,
    private authProvider: AuthenticationProvider,
    private urlProvider: UrlProvider,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.platform.is('cordova') || !request.url.startsWith('http')) {
      return next.handle(request);
    }

    const logUrl = new URL(request.url);

    if (logUrl.pathname.endsWith('/logs')) {
      const newRequest = request.clone({
        setHeaders: {
          'x-api-key': this.urlProvider.getLogsServiceApiKey(),
        },
      });
      return next.handle(newRequest);
    }

    return from(this.authProvider.getAuthenticationToken())
      .pipe(
        switchMap((token: string) => {
          if (token) {
            const newRequest = request.clone({
              setHeaders: {
                Authorization: token,
              },
            });
            return next.handle(newRequest);
          }
          return next.handle(request);
        }),
      );
  }

}

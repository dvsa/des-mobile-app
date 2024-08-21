import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UrlProvider } from '../url/url';
import { AuthenticationProvider } from './authentication';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private platform: Platform,
    private authProvider: AuthenticationProvider,
    private urlProvider: UrlProvider
  ) {}

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
    return from(this.authProvider.getAuthenticationToken()).pipe(
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
      })
    );
  }
}

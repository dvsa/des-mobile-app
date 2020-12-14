import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { Network } from '@ionic-native/network/ngx';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppConfigProvider } from './providers/app-config/app-config';
import { AuthenticationProvider } from './providers/authentication/authentication';
import { DataStoreProvider } from './providers/data-store/data-store';
import { NetworkStateProvider } from './providers/network-state/network-state';
import { AppInfoProvider } from './providers/app-info/app-info';
import { DateTimeProvider } from './providers/date-time/date-time';
import { environment } from '../environments/environment';
import { AuthGuard } from './guards/auth-guard';
import { AppInfoStoreModule } from '../store/app-info/app-info.module';
import { AuthInterceptor } from './providers/authentication/interceptor';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    AppInfoStoreModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppVersion,
    AppConfigProvider,
    AuthenticationProvider,
    AppInfoProvider,
    DateTimeProvider,
    AuthGuard,
    SecureStorage,
    DataStoreProvider,
    Network,
    NetworkStateProvider,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

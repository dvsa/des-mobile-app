import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppConfigProvider } from './providers/app-config/app-config';
import { AuthenticationProvider } from './providers/authentication/authentication';
import { DataStoreProvider } from './providers/data-store/data-store';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NetworkStateProvider } from './providers/network-state/network-state';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppConfigProvider,
    AuthenticationProvider,
    SecureStorage,
    DataStoreProvider,
    Network,
    NetworkStateProvider,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

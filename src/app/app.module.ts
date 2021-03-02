import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { EmmAppConfig } from '@ionic-native/emm-app-config/ngx';
import { IsDebug } from '@ionic-native/is-debug/ngx';

import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ActionReducer, ActionReducerMap, MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppConfigProvider } from './providers/app-config/app-config';
import { AuthenticationProvider } from './providers/authentication/authentication';
import { DataStoreProvider } from './providers/data-store/data-store';
import { NetworkStateProvider } from './providers/network-state/network-state';
import { AppInfoProvider } from './providers/app-info/app-info';
import { environment } from '../environments/environment';
import { AppInfoStoreModule } from '../store/app-info/app-info.module';
import { AuthInterceptor } from './providers/authentication/interceptor';
import { JournalProvider } from './providers/journal/journal';
import { UrlProvider } from './providers/url/url';
import { DateTimeProvider } from './providers/date-time/date-time';
import { LogsStoreModule } from '../store/logs/logs.module';
import { LogsProvider } from './providers/logs/logs';
import { SchemaValidatorProvider } from './providers/schema-validator/schema-validator';
import { LogHelper } from './providers/logs/logs-helper';
import { JournalModule } from '../store/journal/journal.module';
import { TestPersistenceProvider } from './providers/test-persistence/test-persistence';
import { AnalyticsProvider } from './providers/analytics/analytics';
import { DeviceProvider } from './providers/device/device';
import { CategoryWhitelistProvider } from './providers/category-whitelist/category-whitelist';
import { AppConfigStoreModule } from '../store/app-config/app-config.module';
import { StoreModel } from './shared/models/store.model';
import { appConfigReducer } from '../store/app-config/app-config.reducer';
import { journalReducer } from '../store/journal/journal.reducer';
import { appInfoReducer } from '../store/app-info/app-info.reducer';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['appInfo', 'logs', 'tests', 'journal', 'appConfig'],
    rehydrate: true,
    syncCondition: (state) => {
      const { slots } = state.journal;
      const slotDates = Object.keys(slots);

      return !slotDates.every((date: string) => !slots[date].length);
    },
  })(reducer);
}

const reducers: ActionReducerMap<StoreModel> = {
  journal: journalReducer,
  appInfo: appInfoReducer,
  appConfig: appConfigReducer,
};

const metaReducers: MetaReducer<any, any>[] = [localStorageSyncReducer];
const enableDevTools = environment && environment.enableDevTools;
// const enableRehydrationPlugin = environment && environment.enableRehydrationPlugin;

// if (enableRehydrationPlugin) {
// metaReducers.push(localStorageSyncReducer);
// }
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(),
    ...(enableDevTools ? [StoreDevtoolsModule.instrument()] : []),
    AppInfoStoreModule,
    AppConfigStoreModule,
    LogsStoreModule,
    JournalModule,
  ],
  providers: [
    SplashScreen,
    AppVersion,
    AppConfigProvider,
    AuthenticationProvider,
    AppInfoProvider,
    DateTimeProvider,
    SecureStorage,
    IsDebug,
    GoogleAnalytics,
    DataStoreProvider,
    Network,
    NetworkStateProvider,
    UrlProvider,
    DateTimeProvider,
    JournalProvider,
    AnalyticsProvider,
    DeviceProvider,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    LogsProvider,
    LogHelper,
    SchemaValidatorProvider,
    EmmAppConfig,
    TestPersistenceProvider,
    CategoryWhitelistProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

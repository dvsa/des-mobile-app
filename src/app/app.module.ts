import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { EmmAppConfig } from '@ionic-native/emm-app-config/ngx';
import { IsDebug } from '@ionic-native/is-debug/ngx';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';

import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { Network } from '@ionic-native/network/ngx';
import {
  ActionReducer, ActionReducerMap, MetaReducer, StoreModule,
} from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
import { Device } from '@ionic-native/device/ngx';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppConfigProvider } from '@providers/app-config/app-config';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AuthInterceptor } from '@providers/authentication/interceptor';
import { JournalProvider } from '@providers/journal/journal';
import { UrlProvider } from '@providers/url/url';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { LogsProvider } from '@providers/logs/logs';
import { SchemaValidatorProvider } from '@providers/schema-validator/schema-validator';
import { LogHelper } from '@providers/logs/logs-helper';
import { TestPersistenceProvider } from '@providers/test-persistence/test-persistence';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { DeviceProvider } from '@providers/device/device';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { TestCentreJournalProvider } from '@providers/test-centre-journal/test-centre-journal';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { environment } from '@environments/environment';

import { JournalModule } from '@store/journal/journal.module';
import { AppConfigStoreModule } from '@store/app-config/app-config.module';
import { appConfigReducer } from '@store/app-config/app-config.reducer';
import { journalReducer } from '@store/journal/journal.reducer';
import { appInfoReducer } from '@store/app-info/app-info.reducer';
import { testsReducer } from '@store/tests/tests.reducer';
import { LogsStoreModule } from '@store/logs/logs.module';
import { AppInfoStoreModule } from '@store/app-info/app-info.module';
import { TestsModule } from '@store/tests/tests.module';
import { TestCentreJournalStoreModule } from '@store/test-centre-journal/test-centre-journal.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RemoteDevToolsProxy } from '../../ngrx-devtool-proxy/remote-devtools-proxy';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['appInfo', 'tests', 'appConfig'],
    rehydrate: true,
  })(reducer);
}

const reducers: ActionReducerMap<any> = {
  journal: journalReducer,
  appInfo: appInfoReducer,
  appConfig: appConfigReducer,
  tests: testsReducer,
};

const metaReducers: MetaReducer<any, any>[] = [];
const enableDevTools = environment && environment.enableDevTools;
const enableRehydrationPlugin = environment && environment.enableRehydrationPlugin;

// Register our remote devtools if we're on-device and not in a browser and dev tools enabled
if (!window['devToolsExtension'] && !window['__REDUX_DEVTOOLS_EXTENSION__'] && enableDevTools) {
  const remoteDevToolsProxy = new RemoteDevToolsProxy({
    connectTimeout: 300000, // extend for pauses during debugging
    ackTimeout: 120000, // extend for pauses during debugging
    secure: false, // dev only
  });

  // support both the legacy and new keys, for now
  window['devToolsExtension'] = remoteDevToolsProxy;
  window['__REDUX_DEVTOOLS_EXTENSION__'] = remoteDevToolsProxy;
}

if (enableRehydrationPlugin) {
  metaReducers.push(localStorageSyncReducer);
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ swipeBackEnabled: false }),
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(),
    ...(enableDevTools ? [StoreDevtoolsModule.instrument()] : []),
    AppInfoStoreModule,
    AppConfigStoreModule,
    LogsStoreModule,
    TestCentreJournalStoreModule,
    JournalModule,
    TestsModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    SplashScreen,
    MobileAccessibility,
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
    Device,
    NetworkStateProvider,
    UrlProvider,
    DateTimeProvider,
    JournalProvider,
    AnalyticsProvider,
    DeviceProvider,
    LogsProvider,
    LogHelper,
    SchemaValidatorProvider,
    EmmAppConfig,
    TestPersistenceProvider,
    CategoryWhitelistProvider,
    TestCentreJournalProvider,
    RouteByCategoryProvider,
    ScreenOrientation,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

import { ErrorHandler, enableProdMode, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { appEffects } from '@app/app.effects';
import { routes } from '@app/app.routes';
import { SentryIonicErrorHandler } from '@app/sentry-error-handler';
import { IsDebug } from '@awesome-cordova-plugins/is-debug/ngx';
import { SecureStorage } from '@awesome-cordova-plugins/secure-storage/ngx';
import { Capacitor } from '@capacitor/core';
import { environment } from '@environments/environment';
import { EnvironmentFile, TestersEnvironmentFile } from '@environments/models/environment.model';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionReducer, ActionReducerMap, MetaReducer, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { delegatedSearchReducer } from '@pages/delegated-rekey-search/delegated-rekey-search.reducer';
import { rekeyReasonReducer } from '@pages/rekey-reason/rekey-reason.reducer';
import { rekeySearchReducer } from '@pages/rekey-search/rekey-search.reducer';
import { testReportFeatureKey, testReportReducer } from '@pages/test-report/test-report.reducer';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthInterceptor } from '@providers/authentication/interceptor';
import { appConfigFeatureKey, appConfigReducer } from '@store/app-config/app-config.reducer';
import { appInfoFeatureKey, appInfoReducer } from '@store/app-info/app-info.reducer';
import * as examinerRecordsReducer from '@store/examiner-records/examiner-records.reducer';
import { journalReducer } from '@store/journal/journal.reducer';
import { logsFeatureKey, logsReducer } from '@store/logs/logs.reducer';
import { refDataFeatureKey, referenceDataReducer } from '@store/reference-data/reference-data.reducer';
import {
  testCentreJournalFeatureKey,
  testCentreJournalReducer,
} from '@store/test-centre-journal/test-centre-journal.reducer';
import { testsReducer } from '@store/tests/tests.reducer';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { get, set } from 'lodash-es';
import { localStorageSync } from 'ngrx-store-localstorage';
import { RemoteDevToolsProxy } from '../ngrx-devtool-proxy/remote-devtools-proxy';

const enableDevTools = environment && (environment as EnvironmentFile).enableDevTools;
const enableRehydrationPlugin = environment && (environment as EnvironmentFile).enableRehydrationPlugin;
const metaReducers: MetaReducer<unknown>[] = [];

export function localStorageSyncReducer(reducer: ActionReducer<unknown>): ActionReducer<unknown> {
  return localStorageSync({
    keys: ['appInfo', 'tests', 'appConfig', 'refData'],
    rehydrate: true,
  })(reducer);
}

if (enableRehydrationPlugin) {
  metaReducers.push(localStorageSyncReducer);
}

if (enableDevTools && !get(window, 'devToolsExtension') && !get(window, '__REDUX_DEVTOOLS_EXTENSION__')) {
  const remoteDevToolsProxy = new RemoteDevToolsProxy({
    connectTimeout: 300000, // extend for pauses during debugging
    ackTimeout: 120000, // extend for pauses during debugging
    secure: false, // dev only
  });

  set(window, 'devToolsExtension', remoteDevToolsProxy);
  set(window, '__REDUX_DEVTOOLS_EXTENSION__', remoteDevToolsProxy);
}

const storageDriver = Capacitor.getPlatform() === 'web' ? Drivers.IndexedDB : CordovaSQLiteDriver._driver;
const reducers: ActionReducerMap<unknown> = {
  journal: journalReducer,
  [appInfoFeatureKey]: appInfoReducer,
  [appConfigFeatureKey]: appConfigReducer,
  tests: testsReducer,
  rekeySearch: rekeySearchReducer,
  rekeyReason: rekeyReasonReducer,
  delegatedRekeySearch: delegatedSearchReducer,
  [examinerRecordsReducer.examinerRecordsFeatureKey]: examinerRecordsReducer.examinerRecordsReducer,
  [refDataFeatureKey]: referenceDataReducer,
  [logsFeatureKey]: logsReducer,
  [testCentreJournalFeatureKey]: testCentreJournalReducer,
  [testReportFeatureKey]: testReportReducer,
};

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      IonicStorageModule.forRoot({
        driverOrder: [storageDriver],
      }),
      NgbModule
    ),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideStore(reducers, { metaReducers }),
    ...(enableDevTools ? [provideStoreDevtools()] : []),
    appEffects,
    IsDebug,
    SecureStorage,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: SentryIonicErrorHandler,
    },
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: 'assets/i18n/' }),
      fallbackLang: 'en',
      lang: 'en',
    }),
    provideIonicAngular({
      swipeBackEnabled: false,
      animated: get(environment, 'isTest') ? !(environment as TestersEnvironmentFile)?.isTest : true,
      mode: 'ios',
      scrollAssist: false,
      scrollPadding: false,
    }),

    provideHttpClient(withInterceptorsFromDi()),
    provideAppInitializer(async () => {
      const auth = inject(AuthenticationProvider);
      const appConfig = inject(AppConfigProvider);
      await appConfig.initialiseAppConfig();
      return auth.init();
    }),
  ],
})
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err));

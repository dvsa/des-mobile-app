import { ErrorHandler, enableProdMode, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { EffectImportModule } from '@app/effects.module';
import { SentryIonicErrorHandler } from '@app/sentry-error-handler';
import { IsDebug } from '@awesome-cordova-plugins/is-debug/ngx';
import { SecureStorage } from '@awesome-cordova-plugins/secure-storage/ngx';
import { Capacitor } from '@capacitor/core';
import { environment } from '@environments/environment';
import { EnvironmentFile, TestersEnvironmentFile } from '@environments/models/environment.model';
import {
  IonApp,
  IonBadge,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { delegatedSearchReducer } from '@pages/delegated-rekey-search/delegated-rekey-search.reducer';
import { ExaminerRecordsComponentsModule } from '@pages/examiner-records/components/examiner-records-components.module';
import { rekeySearchReducer } from '@pages/rekey-search/rekey-search.reducer';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthInterceptor } from '@providers/authentication/interceptor';
import { BikeCategoryDetailProvider } from '@providers/bike-category-detail/bike-category-detail';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { CompressionProvider } from '@providers/compression/compression';
import { CPCQuestionProvider } from '@providers/cpc-questions/cpc-questions';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { DeviceProvider } from '@providers/device/device';
import { ExaminerRecordsProvider } from '@providers/examiner-records/examiner-records';
import { ExitSAMProvider } from '@providers/exitSAM/exitSAM';
import { JournalProvider } from '@providers/journal/journal';
import { LoadingProvider } from '@providers/loader/loader';
import { LogsProvider } from '@providers/logs/logs';
import { LogHelper } from '@providers/logs/logs-helper';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { QuestionProvider } from '@providers/question/question';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { SchemaValidatorProvider } from '@providers/schema-validator/schema-validator';
import { TestCentreJournalProvider } from '@providers/test-centre-journal/test-centre-journal';
import { TestPersistenceProvider } from '@providers/test-persistence/test-persistence';
import { UrlProvider } from '@providers/url/url';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { AppConfigStoreModule } from '@store/app-config/app-config.module';
import { appConfigReducer } from '@store/app-config/app-config.reducer';
import { AppInfoStoreModule } from '@store/app-info/app-info.module';
import { appInfoReducer } from '@store/app-info/app-info.reducer';
import { ExaminerRecordsStoreModule } from '@store/examiner-records/examiner-records.module';
import { examinerRecordsReducer } from '@store/examiner-records/examiner-records.reducer';
import { SafetyRecallStoreModule } from '@store/general/safety-recall/safety-recall-store.module';
import { JournalModule } from '@store/journal/journal.module';
import { journalReducer } from '@store/journal/journal.reducer';
import { LogsStoreModule } from '@store/logs/logs.module';
import { ReferenceDataStoreModule } from '@store/reference-data/reference-data.module';
import { TestCentreJournalStoreModule } from '@store/test-centre-journal/test-centre-journal.module';
import { TestsModule } from '@store/tests/tests.module';
import { testsReducer } from '@store/tests/tests.reducer';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { get } from 'lodash-es';
import { RemoteDevToolsProxy } from '../ngrx-devtool-proxy/remote-devtools-proxy';

const enableDevTools = environment && (environment as EnvironmentFile).enableDevTools;
const enableRehydrationPlugin = environment && (environment as EnvironmentFile).enableRehydrationPlugin;
const metaReducers: MetaReducer<unknown>[] = [];
const remoteDevToolsProxy = new RemoteDevToolsProxy({
  connectTimeout: 300000, // extend for pauses during debugging
  ackTimeout: 120000, // extend for pauses during debugging
  secure: false, // dev only
});
const storageDriver = Capacitor.getPlatform() === 'web' ? Drivers.IndexedDB : CordovaSQLiteDriver._driver;
const reducers: ActionReducerMap<unknown> = {
  journal: journalReducer,
  appInfo: appInfoReducer,
  appConfig: appConfigReducer,
  tests: testsReducer,
  rekeySearch: rekeySearchReducer,
  delegatedRekeySearch: delegatedSearchReducer,
  examinerRecords: examinerRecordsReducer,
};

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      IonicStorageModule.forRoot({
        driverOrder: [storageDriver],
      }),
      StoreModule.forRoot(reducers, { metaReducers }),
      EffectsModule.forRoot(),
      EffectImportModule,
      SafetyRecallStoreModule,
      ...(enableDevTools ? [StoreDevtoolsModule.instrument()] : []),
      AppInfoStoreModule,
      ReferenceDataStoreModule,
      AppConfigStoreModule,
      ExaminerRecordsStoreModule,
      LogsStoreModule,
      TestCentreJournalStoreModule,
      JournalModule,
      TestsModule,
      NgbModule,
      ExaminerRecordsComponentsModule,
      IonApp,
      IonMenu,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonItem,
      IonLabel,
      IonBadge,
      IonList,
      IonFooter,
      IonRouterOutlet
    ),
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
    AppConfigProvider,
    ExaminerRecordsProvider,
    ExitSAMProvider,
    AuthenticationProvider,
    CompressionProvider,
    AppInfoProvider,
    LoadingProvider,
    DateTimeProvider,
    SecureStorage,
    IsDebug,
    DataStoreProvider,
    NetworkStateProvider,
    UrlProvider,
    JournalProvider,
    AnalyticsProvider,
    DeviceProvider,
    CompressionProvider,
    LogsProvider,
    LogHelper,
    SchemaValidatorProvider,
    TestPersistenceProvider,
    CompletedTestPersistenceProvider,
    CategoryWhitelistProvider,
    TestCentreJournalProvider,
    RouteByCategoryProvider,
    DeviceAuthenticationProvider,
    QuestionProvider,
    CommonModule,
    WeatherConditionProvider,
    OutcomeBehaviourMapProvider,
    BikeCategoryDetailProvider,
    CPCQuestionProvider,
    ADI3AssessmentProvider,
    PassCertificateValidationProvider,
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

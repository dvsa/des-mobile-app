import { ErrorHandler, enableProdMode, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { SentryIonicErrorHandler } from '@app/sentry-error-handler';
import { IsDebug } from '@awesome-cordova-plugins/is-debug/ngx';
import { SecureStorage } from '@awesome-cordova-plugins/secure-storage/ngx';
import { Capacitor } from '@capacitor/core';
import { ExitSingleAppModeAnalyticsEffects } from '@components/common/test-flow-header/exit-sam.analytics.effects';
import { ExitSingleAppModeEffects } from '@components/common/test-flow-header/exit-sam.effects';
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
import { ExaminerRecordsEffects } from '@pages/examiner-records/examiner-records.effects';
import { FakeJournalAnalyticsEffects } from '@pages/fake-journal/fake-journal.analytics.effects';
import { FakeJournalEffects } from '@pages/fake-journal/fake-journal.effects';
import { LoginPageAnalyticsEffects } from '@pages/login/login-page.analytics.effects';
import { rekeySearchReducer } from '@pages/rekey-search/rekey-search.reducer';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationAnalyticsEffects } from '@providers/authentication/authentication.analytics.effects';
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
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { JournalProvider } from '@providers/journal/journal';
import { LoadingProvider } from '@providers/loader/loader';
import { LogsProvider } from '@providers/logs/logs';
import { LogHelper } from '@providers/logs/logs-helper';
import { ManoeuvresByCategoryProvider } from '@providers/manoeuvres-by-category/manoeuvres-by-category';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { QuestionProvider } from '@providers/question/question';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { SchemaValidatorProvider } from '@providers/schema-validator/schema-validator';
import { SearchProvider } from '@providers/search/search';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotProvider } from '@providers/slot/slot';
import { TestCentreJournalProvider } from '@providers/test-centre-journal/test-centre-journal';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { TestPersistenceProvider } from '@providers/test-persistence/test-persistence';
import { TestSubmissionProvider } from '@providers/test-submission/test-submission';
import { UrlProvider } from '@providers/url/url';
import { VehicleDetailsByCategoryProvider } from '@providers/vehicle-details-by-category/vehicle-details-by-category';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { LogoutBasePageAnalyticsEffects } from '@shared/classes/logout-base-page/logout-base-page.analytics.effects';
import { AppConfigEffects } from '@store/app-config/app-config.effects';
import { appConfigFeatureKey, appConfigReducer } from '@store/app-config/app-config.reducer';
import { AppInfoEffects } from '@store/app-info/app-info.effects';
import { appInfoFeatureKey, appInfoReducer } from '@store/app-info/app-info.reducer';
import * as examinerRecordsReducer from '@store/examiner-records/examiner-records.reducer';
import { SafetyRecallAnalyticsEffects } from '@store/general/safety-recall/safety-recall.analytics.effects';
import { JournalEffects } from '@store/journal/journal.effects';
import { JournalLogsEffects } from '@store/journal/journal.logs.effects';
import { journalReducer } from '@store/journal/journal.reducer';
import { LogsEffects } from '@store/logs/logs.effects';
import { logsFeatureKey, logsReducer } from '@store/logs/logs.reducer';
import { ReferenceDataEffects } from '@store/reference-data/reference-data.effects';
import { refDataFeatureKey, referenceDataReducer } from '@store/reference-data/reference-data.reducer';
import { TestCentreJournalEffects } from '@store/test-centre-journal/test-centre-journal.effects';
import {
  testCentreJournalFeatureKey,
  testCentreJournalReducer,
} from '@store/test-centre-journal/test-centre-journal.reducer';
import { AccompanimentAnalyticsEffects } from '@store/tests/accompaniment/accompaniment.analytics.effects';
import { ExaminerBookedEffects } from '@store/tests/examiner-booked/examiner-booked.effects';
import { ExaminerConductedEffects } from '@store/tests/examiner-conducted/examiner-conducted.effects';
import { PreTestDeclarationsAnalyticsEffects } from '@store/tests/pre-test-declarations/pre-test-declarations.analytics.effects';
import { EyesightTestAnalyticsEffects } from '@store/tests/test-data/common/eyesight-test/eyesight-test.analytics.effects';
import { TestDataEffects } from '@store/tests/test-data/test-data.effects';
import { TestStatusAnalyticsEffects } from '@store/tests/test-status/test-status.analytics.effects';
import { TestsAnalyticsEffects } from '@store/tests/tests.analytics.effects';
import { TestsEffects } from '@store/tests/tests.effects';
import { testsReducer } from '@store/tests/tests.reducer';
import { UserExitedAppAnalyticsEffects } from '@store/tests/user-exited-app/user-exited-app.analytics.effects';
import { VehicleDetailsAnalyticsEffects } from '@store/tests/vehicle-details/vehicle-details.analytics.effects';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { get } from 'lodash-es';
import { RemoteDevToolsProxy } from '../ngrx-devtool-proxy/remote-devtools-proxy';

//Any effect files must be added to this list in order for them to work
const effects = [
  EffectsModule.forFeature([
    ExitSingleAppModeEffects,
    ExitSingleAppModeAnalyticsEffects,
    LogoutBasePageAnalyticsEffects,
    LoginPageAnalyticsEffects,
    AuthenticationAnalyticsEffects,
    EyesightTestAnalyticsEffects,
    AccompanimentAnalyticsEffects,
    VehicleDetailsAnalyticsEffects,
    FakeJournalEffects,
    FakeJournalAnalyticsEffects,
    SafetyRecallAnalyticsEffects,
    AppConfigEffects,
    AppInfoEffects,
    ReferenceDataEffects,
    TestsEffects,
    TestsAnalyticsEffects,
    TestDataEffects,
    ExaminerBookedEffects,
    ExaminerConductedEffects,
    TestStatusAnalyticsEffects,
    PreTestDeclarationsAnalyticsEffects,
    UserExitedAppAnalyticsEffects,
    ExaminerRecordsEffects,
    JournalEffects,
    JournalLogsEffects,
    TestCentreJournalEffects,
    LogsEffects,
  ]),
];

const store = [
  StoreModule.forFeature('journal', journalReducer),
  StoreModule.forFeature('tests', testsReducer),
  StoreModule.forFeature(appConfigFeatureKey, appConfigReducer),
  StoreModule.forFeature(appInfoFeatureKey, appInfoReducer),
  StoreModule.forFeature(refDataFeatureKey, referenceDataReducer),
  StoreModule.forFeature(logsFeatureKey, logsReducer),
  StoreModule.forFeature(testCentreJournalFeatureKey, testCentreJournalReducer),
  StoreModule.forFeature(
    examinerRecordsReducer.examinerRecordsFeatureKey,
    examinerRecordsReducer.examinerRecordsReducer
  ),
];

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
  examinerRecords: examinerRecordsReducer.examinerRecordsReducer,
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
      ...effects,
      ...store,
      ...(enableDevTools ? [StoreDevtoolsModule.instrument()] : []),
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
    SearchProvider,
    SlotProvider,
    SlotSelectorProvider,
    TestSubmissionProvider,
    FaultCountProvider,
    NavigationStateProvider,
    TestDataByCategoryProvider,
    ManoeuvresByCategoryProvider,
    VehicleDetailsByCategoryProvider,
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

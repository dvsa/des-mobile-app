import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IsDebug } from '@awesome-cordova-plugins/is-debug/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { CommonModule } from '@angular/common';
import { GoogleAnalytics } from '@awesome-cordova-plugins/google-analytics/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { SecureStorage } from '@awesome-cordova-plugins/secure-storage/ngx';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, ActionReducerMap, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { localStorageSync } from 'ngrx-store-localstorage';

import { environment } from '@environments/environment';
import { EnvironmentFile, TestersEnvironmentFile } from '@environments/models/environment.model';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthInterceptor } from '@providers/authentication/interceptor';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceProvider } from '@providers/device/device';
import { JournalProvider } from '@providers/journal/journal';
import { LogsProvider } from '@providers/logs/logs';
import { LogHelper } from '@providers/logs/logs-helper';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { QuestionProvider } from '@providers/question/question';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { SchemaValidatorProvider } from '@providers/schema-validator/schema-validator';
import { TestCentreJournalProvider } from '@providers/test-centre-journal/test-centre-journal';
import { TestPersistenceProvider } from '@providers/test-persistence/test-persistence';
import { UrlProvider } from '@providers/url/url';

import { SentryIonicErrorHandler } from '@app/sentry-error-handler';
import { DirectivesModule } from '@directives/directives.module';
import { delegatedSearchReducer } from '@pages/delegated-rekey-search/delegated-rekey-search.reducer';
import { rekeySearchReducer } from '@pages/rekey-search/rekey-search.reducer';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { BikeCategoryDetailProvider } from '@providers/bike-category-detail/bike-category-detail';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { CPCQuestionProvider } from '@providers/cpc-questions/cpc-questions';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { PipesModule } from '@shared/pipes/pipes.module';
import { AppConfigStoreModule } from '@store/app-config/app-config.module';
import { appConfigReducer } from '@store/app-config/app-config.reducer';
import { AppInfoStoreModule } from '@store/app-info/app-info.module';
import { appInfoReducer } from '@store/app-info/app-info.reducer';
import { JournalModule } from '@store/journal/journal.module';
import { journalReducer } from '@store/journal/journal.reducer';
import { LogsStoreModule } from '@store/logs/logs.module';
import { ReferenceDataStoreModule } from '@store/reference-data/reference-data.module';
import { TestCentreJournalStoreModule } from '@store/test-centre-journal/test-centre-journal.module';
import { TestsModule } from '@store/tests/tests.module';
import { testsReducer } from '@store/tests/tests.reducer';

import { CompressionProvider } from '@providers/compression/compression';
import { StoreModel } from '@shared/models/store.model';
import { RemoteDevToolsProxy } from '../../ngrx-devtool-proxy/remote-devtools-proxy';
import { IonicGestureConfig } from '../gestures/ionic-gesture-config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function localStorageSyncReducer(reducer: ActionReducer<StoreModel>): ActionReducer<StoreModel> {
	return localStorageSync({
		keys: ['appInfo', 'tests', 'appConfig', 'refData'],
		rehydrate: true,
	})(reducer);
}

const reducers: ActionReducerMap<any> = {
	journal: journalReducer,
	appInfo: appInfoReducer,
	appConfig: appConfigReducer,
	tests: testsReducer,
	rekeySearch: rekeySearchReducer,
	delegatedRekeySearch: delegatedSearchReducer,
};

const metaReducers: MetaReducer<any, any>[] = [];
const enableDevTools = environment && (environment as EnvironmentFile).enableDevTools;
const enableRehydrationPlugin = environment && (environment as EnvironmentFile).enableRehydrationPlugin;

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
	imports: [
		DirectivesModule,
		BrowserModule,
		IonicModule.forRoot({
			swipeBackEnabled: false,
			animated: !(environment as unknown as TestersEnvironmentFile)?.isTest ?? true,
			mode: 'ios',
			scrollAssist: false,
			scrollPadding: false,
		}),
		AppRoutingModule,
		HttpClientModule,
		IonicStorageModule.forRoot(),
		StoreModule.forRoot(reducers, { metaReducers }),
		EffectsModule.forRoot(),
		...(enableDevTools ? [StoreDevtoolsModule.instrument()] : []),
		AppInfoStoreModule,
		ReferenceDataStoreModule,
		AppConfigStoreModule,
		LogsStoreModule,
		TestCentreJournalStoreModule,
		JournalModule,
		TestsModule,
		NgbModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
		}),
		HammerModule,
		PipesModule,
	],
	providers: [
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
			provide: HAMMER_GESTURE_CONFIG,
			useClass: IonicGestureConfig,
		},
		{
			provide: ErrorHandler,
			useClass: SentryIonicErrorHandler,
		},
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
	],
	bootstrap: [AppComponent],
})
export class AppModule {}

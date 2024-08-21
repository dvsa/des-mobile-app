import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { DetectDeviceTheme } from '@pages/dashboard/dashboard.actions';
import { LOGIN_PAGE } from '@pages/page-names.constants';
import { AppInfoProviderMock } from '@providers/app-info/__mocks__/app-info.mock';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { LogHelper } from '@providers/logs/logs-helper';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { DateTime } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';
import {
  AppResumed,
  HasSeenUpdateAvailablePopup,
  LoadAppVersion,
  LoadAppVersionFailure,
  LoadAppVersionSuccess,
  LoadConfigSuccess,
  LoadEmployeeName,
  LoadEmployeeNameSuccess,
  RestartApp,
  SetDateConfigLoaded,
} from '@store/app-info/app-info.actions';
import { AppInfoEffects } from '@store/app-info/app-info.effects';
import { appInfoReducer } from '@store/app-info/app-info.reducer';
import { ReplaySubject, throwError } from 'rxjs';

describe('AppInfoEffects', () => {
  let effects: AppInfoEffects;
  let actions$: ReplaySubject<any>;
  let appInfoProvider: AppInfoProvider;
  let dateTimeProvider: DateTimeProvider;
  let store$: Store<StoreModel>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          appInfo: appInfoReducer,
        }),
      ],
      providers: [
        AppInfoEffects,
        DataStoreProvider,
        LogHelper,
        NetworkStateProvider,
        Network,
        provideMockActions(() => actions$),
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: AppInfoProvider,
          useClass: AppInfoProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(AppInfoEffects);
    appInfoProvider = TestBed.inject(AppInfoProvider);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
    dateTimeProvider = TestBed.inject(DateTimeProvider);
    spyOn(dateTimeProvider, 'now').and.returnValue(new DateTime('2023-01-01'));
  });

  describe('loadAppInfo$', () => {
    it('should call through to `LoadAppVersionSuccess`', (done) => {
      // ACT
      actions$.next(LoadAppVersion());
      // ASSERT
      effects.loadAppInfo$.subscribe((result) => {
        expect(result.type).toEqual(LoadAppVersionSuccess.type);
        done();
      });
    });
    it('should detect error thrown from `getVersionNumber` and call to `LoadAppVersionFailure`', (done) => {
      spyOn(appInfoProvider, 'getVersionNumber').and.callFake(() => throwError(() => new Error('version error')));
      // ACT
      actions$.next(LoadAppVersion());
      // ASSERT
      effects.loadAppInfo$.subscribe((result) => {
        expect(result.type).toEqual(LoadAppVersionFailure.type);
        done();
      });
    });
  });
  describe('loadConfigSuccessEffect$', () => {
    it('should call through to `SetDateConfigLoaded`', (done) => {
      // ACT
      actions$.next(LoadConfigSuccess());
      // ASSERT
      effects.loadConfigSuccessEffect$.subscribe((result: ReturnType<typeof SetDateConfigLoaded>) => {
        expect(result.type).toEqual(SetDateConfigLoaded.type);
        done();
      });
    });
  });
  describe('dateConfigLoaded$', () => {
    it('should call through to `RestartApp` when dates are the same and navigate', (done) => {
      // ASSERT
      store$.dispatch(SetDateConfigLoaded({ refreshDate: '2023-01-02' }));
      // ACT
      actions$.next(SetDateConfigLoaded({ refreshDate: '2023-01-01' }));
      // ASSERT
      effects.dateConfigLoaded$.subscribe((result: ReturnType<typeof HasSeenUpdateAvailablePopup>) => {
        expect(result.type).toEqual(HasSeenUpdateAvailablePopup.type);
        done();
      });
    });
    it('should call through to `RestartApp` when dates are the same and navigate', () => {
      // ASSERT
      store$.dispatch(SetDateConfigLoaded({ refreshDate: '2023-01-01' }));
      // ACT
      actions$.next(SetDateConfigLoaded({ refreshDate: '2023-01-01' }));
      // ASSERT
      effects.dateConfigLoaded$.subscribe((result: ReturnType<typeof HasSeenUpdateAvailablePopup>) => {
        expect(result.type).toEqual(HasSeenUpdateAvailablePopup.type);
      });
    });
  });
  describe('appResumedEffect$', () => {
    it('should not navigate through to LOGIN_PAGE when dates are same', () => {
      // ASSERT
      store$.dispatch(SetDateConfigLoaded({ refreshDate: '2023-01-01' }));
      // ACT
      actions$.next(AppResumed());
      // ASSERT
      effects.appResumedEffect$.subscribe(() => {
        expect(router.navigate).not.toHaveBeenCalledWith([LOGIN_PAGE]);
      });
    });
    it('should call through to `RestartApp` when dates differ then navigate to LOGIN_PAGE', () => {
      spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
      // ASSERT
      store$.dispatch(SetDateConfigLoaded({ refreshDate: '2023-01-02' }));
      // ACT
      actions$.next(AppResumed());
      // ASSERT
      effects.appResumedEffect$.subscribe((result) => {
        if (result.type === RestartApp.type) {
          expect(result.type).toEqual(RestartApp.type);
        } else if (result.type === DetectDeviceTheme.type) {
          expect(result.type).toEqual(DetectDeviceTheme.type);
        }
        expect(router.navigate).toHaveBeenCalledWith([LOGIN_PAGE]);
      });
    });
  });
  describe('loadEmployeeName$', () => {
    it('should call through to `LoadEmployeeNameSuccess`', (done) => {
      // ACT
      actions$.next(LoadEmployeeName());
      // ASSERT
      effects.loadEmployeeName$.subscribe((result: ReturnType<typeof LoadEmployeeNameSuccess>) => {
        expect(result.type).toEqual(LoadEmployeeNameSuccess.type);
        expect(result.employeeName).toEqual('joe blogs');
        done();
      });
    });
  });
});

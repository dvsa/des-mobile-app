import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlertController, IonicModule, ModalController, Platform } from '@ionic/angular';
import { AlertControllerMock, ModalControllerMock, PlatformMock, RouterMock } from '@mocks/index.mock';
import { Router, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, Subscription } from 'rxjs';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { AppConfig } from '@providers/app-config/app-config.model';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { DateTime } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';
import { BasePageComponent } from '@shared/classes/base-page';
import { ComponentsModule } from '@components/common/common-components.module';
import { LoadCompletedTests, LoadJournalSilent } from '@store/journal/journal.actions';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import {
  CompletedTestPersistenceProviderMock,
} from '@providers/completed-test-persistence/__mocks__/completed-test-persistence.mock';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import {
  selectEmployeeId,
  selectEmployeeName,
  selectUpdateAvailablePresented,
  selectVersionNumber,
} from '@store/app-info/app-info.selectors';
import { appInfoReducer } from '@store/app-info/app-info.reducer';
import { SlotProvider } from '@providers/slot/slot';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotSelectorProviderMock } from '@providers/slot-selector/__mocks__/slot-selector.mock';
import { By } from '@angular/platform-browser';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import {
  HasSeenUpdateAvailablePopup,
  LoadAppVersionSuccess,
  UpdateAvailableBadgeClicked,
} from '@store/app-info/app-info.actions';
import { RekeySearchClearState } from '@pages/rekey-search/rekey-search.actions';
import { selectLiveAppVersion, selectRole } from '@store/app-config/app-config.selectors';
import { DashboardPage } from '../dashboard.page';
import { DashboardComponentsModule } from '../components/dashboard-components.module';
import { DashboardPageRoutingModule } from '../dashboard-routing.module';
import { DashboardViewDidEnter, PracticeTestReportCard } from '../dashboard.actions';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let appConfigProvider: AppConfigProvider;
  let store$: MockStore;
  let modalController: ModalController;

  const initialState = {
    appInfo: {
      versionNumber: '4.0',
      employeeName: 'Some One',
      employeeId: '1234567',
      updateAvailablePresented: true,
    },
    appConfig: { role: ExaminerRole.DE },
    journal: { slots: {} },
    tests: { testStatus: {} },
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPage],
      imports: [
        RouterModule.forRoot(
          [
            {
              path: '',
              component: DashboardPage,
            },
          ],
        ),
        IonicModule,
        StoreModule.forRoot({ appInfo: appInfoReducer }),
        DashboardPageRoutingModule,
        DashboardComponentsModule,
        ComponentsModule,
      ],
      providers: [
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AlertController,
          useClass: AlertControllerMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: CompletedTestPersistenceProvider,
          useClass: CompletedTestPersistenceProviderMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: SlotProvider,
          useClass: SlotProviderMock,
        },
        {
          provide: SlotSelectorProvider,
          useClass: SlotSelectorProviderMock,
        },
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    appConfigProvider = TestBed.inject(AppConfigProvider);
    store$ = TestBed.inject(MockStore);
    modalController = TestBed.inject(ModalController);
    spyOn(store$, 'dispatch');
    store$.dispatch(LoadAppVersionSuccess({ versionNumber: '4.0.0.0' }));
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Class', () => {
    describe('ngOnInit', () => {
      it('should get the selectVersionNumber and selectEmployeeName from store on init', () => {
        spyOn(store$, 'select')
          .and
          .returnValue(of({}));
        component.ngOnInit();
        expect(store$.select)
          .toHaveBeenCalledWith(selectVersionNumber);
        expect(store$.select)
          .toHaveBeenCalledWith(selectEmployeeName);
        expect(store$.select)
          .toHaveBeenCalledWith(selectEmployeeId);
        expect(store$.select)
          .toHaveBeenCalledWith(selectRole);
        expect(store$.select)
          .toHaveBeenCalledWith(selectLiveAppVersion);
        expect(store$.select)
          .toHaveBeenCalledWith(selectUpdateAvailablePresented);
      });
    });
    describe('ionViewWillEnter', () => {
      it('should set todaysDate and todaysDateFormatted on view will enter', async () => {
        spyOn(BasePageComponent.prototype, 'ionViewWillEnter');
        await component.ionViewWillEnter();
        expect(component.todaysDate)
          .toEqual(new DateTime('2019-02-01'));
        expect(component.todaysDateFormatted)
          .toEqual('Friday 1st February 2019');
      });
    });
    describe('ionViewDidEnter', () => {
      beforeEach(() => {
        spyOn(BasePageComponent.prototype, 'unlockDevice');
      });
      it('should dispatch the actions but not the native features', async () => {
        spyOn(BasePageComponent.prototype, 'isIos')
          .and
          .returnValue(false);
        await component.ionViewDidEnter();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(DashboardViewDidEnter());
        expect(BasePageComponent.prototype.unlockDevice)
          .toHaveBeenCalled();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(LoadJournalSilent());
      });
      it('should dispatch the actions and run native functionality', async () => {
        spyOn(BasePageComponent.prototype, 'isIos')
          .and
          .returnValue(true);
        await component.ionViewDidEnter();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(DashboardViewDidEnter());
        expect(BasePageComponent.prototype.unlockDevice)
          .toHaveBeenCalled();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(LoadJournalSilent());
        expect(store$.dispatch)
          .toHaveBeenCalledWith(LoadCompletedTests(true));
      });
      it('should exclude various actions when delegated examiner', async () => {
        spyOn(BasePageComponent.prototype, 'isIos')
          .and
          .returnValue(true);
        spyOn(appConfigProvider, 'getAppConfig')
          .and
          .returnValue({ role: ExaminerRole.DLG } as AppConfig);
        await component.ionViewDidEnter();
        expect(store$.dispatch)
          .not.toHaveBeenCalledWith(LoadJournalSilent());
        expect(store$.dispatch)
          .not.toHaveBeenCalledWith(LoadCompletedTests(true));
      });
    });
    describe('showTestReportPracticeMode', () => {
      it('should return true when enableTestReportPracticeMode is true', () => {
        expect(component.showTestReportPracticeMode())
          .toEqual(true);
      });
      it('should return false when enableTestReportPracticeMode is not true', () => {
        spyOn(appConfigProvider, 'getAppConfig')
          .and
          .returnValue({
            journal: {
              enableTestReportPracticeMode: false,
            },
          } as AppConfig);
        expect(component.showTestReportPracticeMode())
          .toEqual(false);
      });
    });
    describe('showEndToEndPracticeMode', () => {
      it('should return true when enableEndToEndPracticeMode is true', () => {
        expect(component.showEndToEndPracticeMode())
          .toEqual(true);
      });
      it('should return false when enableEndToEndPracticeMode is not true', () => {
        spyOn(appConfigProvider, 'getAppConfig')
          .and
          .returnValue({
            journal: {
              enableEndToEndPracticeMode: false,
            },
          } as AppConfig);
        expect(component.showEndToEndPracticeMode())
          .toEqual(false);
      });
    });
    describe('showDelegatedExaminerRekey', () => {
      it('should return false when role is not DLG', () => {
        expect(component.showDelegatedExaminerRekey())
          .toEqual(false);
      });
      it('should return true when role is DLG', () => {
        spyOn(appConfigProvider, 'getAppConfig')
          .and
          .returnValue({ role: ExaminerRole.DLG } as AppConfig);
        expect(component.showDelegatedExaminerRekey())
          .toEqual(true);
      });
    });
    describe('getRoleDisplayValue', () => {
      it('should return the descriptor for role if known', () => {
        expect(component.getRoleDisplayValue('DE'))
          .toEqual('Driving Examiner');
      });
      it('should return Unknown when not DE/LDTM/DLG', () => {
        expect(component.getRoleDisplayValue('OTHER'))
          .toEqual('Unknown Role');
      });
    });
    describe('getEmployeeNumberDisplayValue', () => {
      it('should return the value if non null/undefined', () => {
        expect(component.getEmployeeNumberDisplayValue('1234567'))
          .toEqual('1234567');
      });
      it('should return not known if null/undefined', () => {
        expect(component.getEmployeeNumberDisplayValue(null))
          .toEqual('NOT_KNOWN');
      });
    });
    describe('practiceTestReportCardClicked', () => {
      it('should dispatch an action', () => {
        component.practiceTestReportCardClicked();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PracticeTestReportCard());
      });
    });
    describe('ionViewDidLeave', () => {
      it('should dispatch a clear action and unsubscribe from page subs', () => {
        component.subscription = new Subscription();

        spyOn(component.subscription, 'unsubscribe');

        component.ionViewDidLeave();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(RekeySearchClearState());
        expect(component.subscription.unsubscribe)
          .toHaveBeenCalled();
      });
    });
    describe('showUpdateAvailableModal', () => {
      it('should dispatch UpdateAvailableBadgeClicked when manualClick is false', async () => {
        spyOn(modalController, 'dismiss')
          .and
          .returnValue(Promise.resolve(true));
        await component.showUpdateAvailableModal(true);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(UpdateAvailableBadgeClicked());
      });
      it('should create and dismiss the modal, then dispatch HasSeenUpdateAvailablePopup', async () => {
        spyOn(modalController, 'dismiss')
          .and
          .returnValue(Promise.resolve(true));
        await component.showUpdateAvailableModal(false);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(HasSeenUpdateAvailablePopup(true));
      });
    });
  });
  describe('DOM', () => {
    describe('test report practice mode', () => {
      it('should show test report practice mode banner when config is set to true', () => {
        component.showTestReportPracticeMode = jasmine.createSpy('showTestReportPracticeMode')
          .and
          .returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#testReportPracticeMode')))
          .not
          .toBeNull();
      });
      it('should not show test report practice mode banner when config is set to false', () => {
        component.showTestReportPracticeMode = jasmine.createSpy('showTestReportPracticeMode')
          .and
          .returnValue(false);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#testReportPracticeMode')))
          .toBeNull();
      });
      it('should show test report practice mode banner when showDelegatedExaminerRekey returns true', () => {
        spyOn(component, 'showDelegatedExaminerRekey')
          .and
          .returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('practice-test-report-card')))
          .not
          .toBeNull();
      });
    });
    describe('end to end practice mode', () => {
      it('should show the end to end practice mode banner when config is set to true', () => {
        component.showEndToEndPracticeMode = jasmine.createSpy('showEndToEndPracticeMode')
          .and
          .returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#endToendPracticeMode')))
          .not
          .toBeNull();
      });
      it('should not show the end to end practice mode banner when config is set to false', () => {
        component.showEndToEndPracticeMode = jasmine.createSpy('showEndToEndPracticeMode')
          .and
          .returnValue(false);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#endToendPracticeMode')))
          .toBeNull();
      });
      it('should show the end to end practice mode banner when showDelegatedExaminerRekey returns true', () => {
        spyOn(component, 'showDelegatedExaminerRekey')
          .and
          .returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('practice-end-to-end-card')))
          .not
          .toBeNull();
      });
    });
    describe('goToJournalCard', () => {
      it('should not show journal card when showDelegatedExaminerRekey returns true', () => {
        spyOn(component, 'showDelegatedExaminerRekey')
          .and
          .returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('go-to-journal-card')))
          .toBeNull();
      });
      it('should show the journal card when showDelegatedExaminerRekey returns false', () => {
        spyOn(component, 'showDelegatedExaminerRekey')
          .and
          .returnValue(false);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('go-to-journal-card')))
          .not
          .toBeNull();
      });
    });

    describe('showDelegatedExaminerRekey', () => {
      it('should show the delegated examiner rekey card when showDelegatedExaminerRekey returns true', () => {
        spyOn(component, 'showDelegatedExaminerRekey')
          .and
          .returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('delegated-examiner-rekey')))
          .not
          .toBeNull();
      });
    });

    describe('isDelegatedExaminer', () => {
      it('should return true when the role is DLG', () => {

        spyOn(appConfigProvider, 'getAppConfig')
          .and.returnValue({ role: ExaminerRole.DLG } as AppConfig);
        expect(component.isDelegatedExaminer()).toBeTrue();
      });

      it('should return false when the role is not DLG', () => {
        spyOn(appConfigProvider, 'getAppConfig')
          .and.returnValue({ role: ExaminerRole.DE } as AppConfig);
        expect(component.isDelegatedExaminer()).toBeFalse();
      });

      it('should return false when the role is undefined', () => {
        spyOn(appConfigProvider, 'getAppConfig')
          .and.returnValue({} as AppConfig);
        expect(component.isDelegatedExaminer()).toBeFalse();
      });

      it('should return false when the app config is undefined', () => {
        spyOn(appConfigProvider, 'getAppConfig')
          .and.returnValue(undefined);
        expect(component.isDelegatedExaminer()).toBeFalse();
      });
    });

    describe('rekeySearchCard', () => {
      it('should NOT hide the rekey search card when showDelegatedExaminerRekey returns true', () => {
        spyOn(component, 'showDelegatedExaminerRekey')
          .and
          .returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('rekey-search-card')))
          .not
          .toBeNull();
      });
    });
  });
});

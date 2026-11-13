import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { VehicleRecallsBanner } from '@components/common/vehicle-recall-banner/vehicle-recalls-banner';
import { AlertController, IonMenuButton, ModalController, Platform } from '@ionic/angular';
import { AlertControllerMock, ModalControllerMock, PlatformMock, RouterMock } from '@mocks/index.mock';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RekeySearchClearState } from '@pages/rekey-search/rekey-search.actions';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfig } from '@providers/app-config/app-config.model';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { CompletedTestPersistenceProviderMock } from '@providers/completed-test-persistence/__mocks__/completed-test-persistence.mock';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { SlotSelectorProviderMock } from '@providers/slot-selector/__mocks__/slot-selector.mock';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { SlotProvider } from '@providers/slot/slot';
import { BasePageComponent } from '@shared/classes/base-page';
import { DateTime } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';
import { selectLiveAppVersion, selectRole } from '@store/app-config/app-config.selectors';
import {
  HasSeenUpdateAvailablePopup,
  LoadAppVersionSuccess,
  UpdateAvailableBadgeClicked,
} from '@store/app-info/app-info.actions';
import { appInfoReducer } from '@store/app-info/app-info.reducer';
import {
  selectEmployeeId,
  selectEmployeeName,
  selectUpdateAvailablePresented,
  selectVersionNumber,
} from '@store/app-info/app-info.selectors';
import { LoadJournalSilent } from '@store/journal/journal.actions';
import { MockComponent } from 'ng-mocks';
import { Subscription, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PracticeTestModal } from '@pages/dashboard/components/practice-test-modal/practice-test-modal';
import { DelegatedSearchCardComponent } from '../components/delegated-rekey-card/delegated-rekey-card';
import { GoToJournalCardComponent } from '../components/go-to-journal-card/go-to-journal-card';
import { PracticeEndToEndCardComponent } from '../components/practice-end-to-end-card/practice-end-to-end-card';
import { PracticeTestReportCardComponent } from '../components/practice-test-report-card/practice-test-report-card';
import { ProfileHeaderComponent } from '../components/profile-header/profile-header';
import { RekeySearchCardComponent } from '../components/rekey-search-card/rekey-search-card';
import { TestCentreJournalCardComponent } from '../components/test-centre-journal-card/test-centre-journal-card';
import { TestResultsSearchCardComponent } from '../components/test-results-search-card/test-results-search-card';
import { UpdateAvailableModal } from '../components/update-available-modal/update-available-modal';
import { DashboardViewDidEnter, PracticeTestReportCard } from '../dashboard.actions';
import { DashboardPage } from '../dashboard.page';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          {
            path: '',
            component: DashboardPage,
          },
        ]),
        StoreModule.forRoot({ appInfo: appInfoReducer }),
        ProfileHeaderComponent,
        GoToJournalCardComponent,
        RekeySearchCardComponent,
        PracticeEndToEndCardComponent,
        TestResultsSearchCardComponent,
        PracticeTestReportCardComponent,
        TestCentreJournalCardComponent,
        PracticeTestModal,
        DelegatedSearchCardComponent,
        UpdateAvailableModal,
        IonMenuButton,
        DashboardPage,
        MockComponent(VehicleRecallsBanner),
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
    appConfigProvider = TestBed.inject(AppConfigProvider);
    store$ = TestBed.inject(MockStore);
    modalController = TestBed.inject(ModalController);
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
    store$.dispatch(LoadAppVersionSuccess({ versionNumber: '4.0.0.0' }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Class', () => {
    describe('ngOnInit', () => {
      it('should get the selectVersionNumber and selectEmployeeName from store on init', () => {
        vi.spyOn(store$, 'select').mockReturnValue(of({}));
        component.ngOnInit();
        expect(store$.select).toHaveBeenCalledWith(selectVersionNumber);
        expect(store$.select).toHaveBeenCalledWith(selectEmployeeName);
        expect(store$.select).toHaveBeenCalledWith(selectEmployeeId);
        expect(store$.select).toHaveBeenCalledWith(selectRole);
        expect(store$.select).toHaveBeenCalledWith(selectLiveAppVersion);
        expect(store$.select).toHaveBeenCalledWith(selectUpdateAvailablePresented);
      });
    });
    describe('ionViewWillEnter', () => {
      it('should set todaysDate and todaysDateFormatted on view will enter', async () => {
        vi.spyOn(BasePageComponent.prototype, 'ionViewWillEnter').mockReturnValue(undefined);
        await component.ionViewWillEnter();
        expect(component.todaysDate).toEqual(new DateTime('2019-02-01'));
        expect(component.todaysDateFormatted).toEqual('Friday 1st February 2019');
      });
    });
    describe('ionViewDidEnter', () => {
      beforeEach(() => {
        vi.spyOn(BasePageComponent.prototype, 'unlockDevice').mockReturnValue(undefined);
      });
      it('should dispatch the actions but not the native features', async () => {
        vi.spyOn(BasePageComponent.prototype, 'isIos').mockReturnValue(false);
        await component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(DashboardViewDidEnter());
        expect(BasePageComponent.prototype.unlockDevice).toHaveBeenCalled();
        expect(store$.dispatch).toHaveBeenCalledWith(LoadJournalSilent());
      });
      it('should dispatch the actions and run native functionality', async () => {
        vi.spyOn(BasePageComponent.prototype, 'isIos').mockReturnValue(true);
        await component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(DashboardViewDidEnter());
        expect(BasePageComponent.prototype.unlockDevice).toHaveBeenCalled();
        expect(store$.dispatch).toHaveBeenCalledWith(LoadJournalSilent());
      });
      it('should exclude various actions when delegated examiner', async () => {
        vi.spyOn(BasePageComponent.prototype, 'isIos').mockReturnValue(true);
        vi.spyOn(appConfigProvider, 'getAppConfig').mockReturnValue({ role: ExaminerRole.DLG } as AppConfig);
        await component.ionViewDidEnter();
        expect(store$.dispatch).not.toHaveBeenCalledWith(LoadJournalSilent());
      });
    });
    describe('showTestReportPracticeMode', () => {
      it('should return true when enableTestReportPracticeMode is true', () => {
        expect(component.showTestReportPracticeMode()).toEqual(true);
      });
      it('should return false when enableTestReportPracticeMode is not true', () => {
        vi.spyOn(appConfigProvider, 'getAppConfig').mockReturnValue({
          journal: {
            enableTestReportPracticeMode: false,
          },
        } as AppConfig);
        expect(component.showTestReportPracticeMode()).toEqual(false);
      });
    });
    describe('showEndToEndPracticeMode', () => {
      it('should return true when enableEndToEndPracticeMode is true', () => {
        expect(component.showEndToEndPracticeMode()).toEqual(true);
      });
      it('should return false when enableEndToEndPracticeMode is not true', () => {
        vi.spyOn(appConfigProvider, 'getAppConfig').mockReturnValue({
          journal: {
            enableEndToEndPracticeMode: false,
          },
        } as AppConfig);
        expect(component.showEndToEndPracticeMode()).toEqual(false);
      });
    });
    describe('showDelegatedExaminerRekey', () => {
      it('should return false when role is not DLG', () => {
        expect(component.showDelegatedExaminerRekey()).toEqual(false);
      });
      it('should return true when role is DLG', () => {
        vi.spyOn(appConfigProvider, 'getAppConfig').mockReturnValue({ role: ExaminerRole.DLG } as AppConfig);
        expect(component.showDelegatedExaminerRekey()).toEqual(true);
      });
    });
    describe('getRoleDisplayValue', () => {
      it('should return the descriptor for role if known', () => {
        expect(component.getRoleDisplayValue('DE')).toEqual('Driving Examiner');
      });
      it('should return Unknown when not DE/LDTM/DLG', () => {
        expect(component.getRoleDisplayValue('OTHER')).toEqual('Unknown Role');
      });
    });
    describe('getEmployeeNumberDisplayValue', () => {
      it('should return the value if non null/undefined', () => {
        expect(component.getEmployeeNumberDisplayValue('1234567')).toEqual('1234567');
      });
      it('should return not known if null/undefined', () => {
        expect(component.getEmployeeNumberDisplayValue(null)).toEqual('NOT_KNOWN');
      });
    });
    describe('practiceTestReportCardClicked', () => {
      it('should dispatch an action', () => {
        component.practiceTestReportCardClicked();
        expect(store$.dispatch).toHaveBeenCalledWith(PracticeTestReportCard());
      });
    });
    describe('ionViewWillLeave', () => {
      it('should dispatch a clear action and unsubscribe from page subs', () => {
        component.subscription = new Subscription();

        vi.spyOn(component.subscription, 'unsubscribe').mockReturnValue(undefined);

        component.ionViewWillLeave();
        expect(store$.dispatch).toHaveBeenCalledWith(RekeySearchClearState());
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });
  describe('showUpdateAvailableModal', () => {
    it('should dispatch UpdateAvailableBadgeClicked when manualClick is false', async () => {
      vi.spyOn(modalController, 'dismiss').mockReturnValue(Promise.resolve(true));
      await component.showUpdateAvailableModal(true);
      expect(store$.dispatch).toHaveBeenCalledWith(UpdateAvailableBadgeClicked());
    });
    it('should create and dismiss the modal, then dispatch HasSeenUpdateAvailablePopup', async () => {
      vi.spyOn(modalController, 'dismiss').mockReturnValue(Promise.resolve(true));
      await component.showUpdateAvailableModal(false);
      expect(store$.dispatch).toHaveBeenCalledWith(HasSeenUpdateAvailablePopup(true));
    });
  });
  describe('DOM', () => {
    describe('test report practice mode', () => {
      it('should show test report practice mode banner when config is set to true', () => {
        component.showTestReportPracticeMode = vi.fn().mockReturnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#testReportPracticeMode'))).not.toBeNull();
      });
      it('should not show test report practice mode banner when config is set to false', () => {
        component.showTestReportPracticeMode = vi.fn().mockReturnValue(false);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#testReportPracticeMode'))).toBeNull();
      });
      it('should show test report practice mode banner when showDelegatedExaminerRekey returns true', () => {
        vi.spyOn(component, 'showDelegatedExaminerRekey').mockReturnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('practice-test-report-card'))).not.toBeNull();
      });
    });
    describe('end to end practice mode', () => {
      it('should show the end to end practice mode banner when config is set to true', () => {
        component.showEndToEndPracticeMode = vi.fn().mockReturnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#endToendPracticeMode'))).not.toBeNull();
      });
      it('should not show the end to end practice mode banner when config is set to false', () => {
        component.showEndToEndPracticeMode = vi.fn().mockReturnValue(false);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#endToendPracticeMode'))).toBeNull();
      });
      it('should show the end to end practice mode banner when showDelegatedExaminerRekey returns true', () => {
        vi.spyOn(component, 'showDelegatedExaminerRekey').mockReturnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('practice-end-to-end-card'))).not.toBeNull();
      });
    });
    describe('goToJournalCard', () => {
      it('should not show journal card when showDelegatedExaminerRekey returns true', () => {
        vi.spyOn(component, 'showDelegatedExaminerRekey').mockReturnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('go-to-journal-card'))).toBeNull();
      });
      it('should show the journal card when showDelegatedExaminerRekey returns false', () => {
        vi.spyOn(component, 'showDelegatedExaminerRekey').mockReturnValue(false);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('go-to-journal-card'))).not.toBeNull();
      });
    });

    describe('showDelegatedExaminerRekey', () => {
      it('should show the delegated examiner rekey card when showDelegatedExaminerRekey returns true', () => {
        vi.spyOn(component, 'showDelegatedExaminerRekey').mockReturnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('delegated-examiner-rekey'))).not.toBeNull();
      });
    });

    describe('isDelegatedExaminer', () => {
      it('should return true when the role is DLG', () => {
        vi.spyOn(appConfigProvider, 'getAppConfig').mockReturnValue({ role: ExaminerRole.DLG } as AppConfig);
        expect(component.isDelegatedExaminer()).toBe(true);
      });

      it('should return false when the role is not DLG', () => {
        vi.spyOn(appConfigProvider, 'getAppConfig').mockReturnValue({ role: ExaminerRole.DE } as AppConfig);
        expect(component.isDelegatedExaminer()).toBe(false);
      });

      it('should return false when the role is undefined', () => {
        vi.spyOn(appConfigProvider, 'getAppConfig').mockReturnValue({} as AppConfig);
        expect(component.isDelegatedExaminer()).toBe(false);
      });

      it('should return false when the app config is undefined', () => {
        vi.spyOn(appConfigProvider, 'getAppConfig').mockReturnValue(undefined);
        expect(component.isDelegatedExaminer()).toBe(false);
      });
    });

    describe('rekeySearchCard', () => {
      it('should NOT hide the rekey search card when showDelegatedExaminerRekey returns true', () => {
        vi.spyOn(component, 'showDelegatedExaminerRekey').mockReturnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('rekey-search-card'))).not.toBeNull();
      });
    });
  });
});

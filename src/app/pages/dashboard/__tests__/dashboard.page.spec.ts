import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, IonicModule, Platform } from '@ionic/angular';
import { AlertControllerMock, PlatformMock } from 'ionic-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

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
import { LoadJournalSilent } from '@store/journal/journal.actions';
import { ScreenOrientationMock } from '@shared/mocks/screen-orientation.mock';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import {
  CompletedTestPersistenceProviderMock,
} from '@providers/completed-test-persistence/__mocks__/completed-test-persistence.mock';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import {
  selectEmployeeId,
  selectEmployeeName,
  selectVersionNumber,
} from '@store/app-info/app-info.selectors';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { selectRole } from '@store/app-config/app-config.selectors';
import { appInfoReducer } from '@store/app-info/app-info.reducer';
import { SlotProvider } from '@providers/slot/slot';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotSelectorProviderMock } from '@providers/slot-selector/__mocks__/slot-selector.mock';
import { By } from '@angular/platform-browser';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { DashboardPage } from '../dashboard.page';
import { DashboardComponentsModule } from '../components/dashboard-components.module';
import { DashboardPageRoutingModule } from '../dashboard-routing.module';
import { DashboardViewDidEnter } from '../dashboard.actions';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
  let appConfigProvider: AppConfigProvider;
  let deviceProvider: DeviceProvider;
  let store$: MockStore;
  let screenOrientation: ScreenOrientation;
  let insomnia: Insomnia;
  let completedTestPersistenceProvider: CompletedTestPersistenceProvider;

  const initialState = {
    appInfo: { versionNumber: '4.0', employeeName: 'Some One', employeeId: '1234567' },
    appConfig: { role: ExaminerRole.DE },
    journal: { slots: {} },
    tests: { testStatus: {} },
  } as StoreModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPage],
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path: '', component: DashboardPage },
          ],
        ),
        IonicModule,
        StoreModule.forRoot({ appInfo: appInfoReducer }),
        DashboardPageRoutingModule,
        DashboardComponentsModule,
        ComponentsModule,
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: Router, useValue: routerSpy },
        { provide: CompletedTestPersistenceProvider, useClass: CompletedTestPersistenceProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: ScreenOrientation, useClass: ScreenOrientationMock },
        { provide: Insomnia, useClass: InsomniaMock },
        { provide: SlotProvider, useClass: SlotProviderMock },
        { provide: SlotSelectorProvider, useClass: SlotSelectorProviderMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appConfigProvider = TestBed.inject(AppConfigProvider);
    store$ = TestBed.inject(MockStore);
    deviceProvider = TestBed.inject(DeviceProvider);
    screenOrientation = TestBed.inject(ScreenOrientation);
    insomnia = TestBed.inject(Insomnia);
    completedTestPersistenceProvider = TestBed.inject(CompletedTestPersistenceProvider);

    spyOn(store$, 'dispatch');
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Class', () => {
    describe('ngOnInit', () => {
      it('should get the selectVersionNumber and selectEmployeeName from store on init', () => {
        const spy = spyOn(store$, 'select')
          .and
          .returnValue(of());
        component.ngOnInit();
        expect(spy)
          .toHaveBeenCalledTimes(4);
        expect(spy.calls.allArgs())
          .toEqual([
            [selectVersionNumber],
            [selectEmployeeName],
            [selectEmployeeId],
            [selectRole],
          ]);
      });
    });
    describe('ionViewWillEnter', () => {
      it('should set todaysDate and todaysDateFormatted on view will enter', async () => {
        spyOn(BasePageComponent.prototype, 'ionViewWillEnter');
        spyOn(completedTestPersistenceProvider, 'loadCompletedPersistedTests');
        await component.ionViewWillEnter();
        expect(component.todaysDate)
          .toEqual(new DateTime('2019-02-01'));
        expect(component.todaysDateFormatted)
          .toEqual('Friday 1st February 2019');
        expect(completedTestPersistenceProvider.loadCompletedPersistedTests)
          .toHaveBeenCalled();
      });
    });
    describe('ionViewDidEnter', () => {
      it('should dispatch the actions but not the native features', async () => {
        spyOn(BasePageComponent.prototype, 'isIos')
          .and
          .returnValue(false);
        await component.ionViewDidEnter();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(DashboardViewDidEnter());
        expect(screenOrientation.unlock)
          .not
          .toHaveBeenCalled();
        expect(insomnia.allowSleepAgain)
          .not
          .toHaveBeenCalled();
        expect(deviceProvider.disableSingleAppMode)
          .not
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
        expect(screenOrientation.unlock)
          .toHaveBeenCalled();
        expect(insomnia.allowSleepAgain)
          .toHaveBeenCalled();
        expect(deviceProvider.disableSingleAppMode)
          .toHaveBeenCalled();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(LoadJournalSilent());
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
  });

  describe('DOM', () => {
    describe('test report practice mode', () => {
      it('should show test report practice mode banner when config is set to true', () => {
        component.showTestReportPracticeMode = jasmine.createSpy('showTestReportPracticeMode').and.returnValue(true);

        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#testReportPracticeMode'))).not.toBeNull();
      });

      it('should not show test report practice mode banner when config is set to false', () => {
        component.showTestReportPracticeMode = jasmine.createSpy('showTestReportPracticeMode').and.returnValue(false);

        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#testReportPracticeMode'))).toBeNull();
      });
      it('should show test report practice mode banner when showDelegatedExaminerRekey returns true', () => {
        spyOn(component, 'showDelegatedExaminerRekey').and.returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('practice-test-report-card'))).not.toBeNull();
      });
    });

    describe('end to end practice mode', () => {
      it('should show the end to end practice mode banner when config is set to true', () => {
        component.showEndToEndPracticeMode = jasmine.createSpy('showEndToEndPracticeMode').and.returnValue(true);

        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#endToendPracticeMode'))).not.toBeNull();

      });

      it('should not show the end to end practice mode banner when config is set to false', () => {
        component.showEndToEndPracticeMode = jasmine.createSpy('showEndToEndPracticeMode').and.returnValue(false);

        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#endToendPracticeMode'))).toBeNull();
      });

      it('should show the end to end practice mode banner when showDelegatedExaminerRekey returns true', () => {
        spyOn(component, 'showDelegatedExaminerRekey').and.returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('practice-end-to-end-card'))).not.toBeNull();
      });
    });
    describe('goToJournalCard', () => {
      it('should not show journal card when showDelegatedExaminerRekey returns true', () => {
        spyOn(component, 'showDelegatedExaminerRekey').and.returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('go-to-journal-card'))).toBeNull();
      });
      it('should show the journal card when showDelegatedExaminerRekey returns false', () => {
        spyOn(component, 'showDelegatedExaminerRekey').and.returnValue(false);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('go-to-journal-card'))).not.toBeNull();
      });
    });
    // @TODO MES-6603 enable when delegate is migrated into des4
    xdescribe('delegatedExaminerRekey', () => {
      it('should show the delegated examiner rekey card when showDelegatedExaminerRekey returns true', () => {
        spyOn(component, 'showDelegatedExaminerRekey').and.returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('delegated-examiner-rekey'))).not.toBeNull();
      });
    });
    describe('rekeySearchCard', () => {
      it('should NOT hide the rekey search card when showDelegatedExaminerRekey returns true', () => {
        spyOn(component, 'showDelegatedExaminerRekey').and.returnValue(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('rekey-search-card'))).not.toBeNull();
      });
    });
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, IonicModule, Platform } from '@ionic/angular';
import { AlertControllerMock, PlatformMock } from 'ionic-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
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
import {
  selectEmployeeId,
  selectEmployeeName,
  selectVersionNumber,
} from '../../../../store/app-info/app-info.selectors';
import { selectRole } from '../../../../store/app-config/app-config.selectors';
import { DashboardPageRoutingModule } from '../dashboard-routing.module';
import { DashboardComponentsModule } from '../components/dashboard-components.module';
import { appInfoReducer } from '../../../../store/app-info/app-info.reducer';
import { DashboardPage } from '../dashboard.page';
import { ComponentsModule } from '../../../../components/common/common-components.module';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
  let appConfigProvider: AppConfigProvider;
  let store$: MockStore;
  const initialState = {
    appInfo: { versionNumber: '4.0', employeeName: 'Some One', employeeId: '1234567' },
    appConfig: { role: ExaminerRole.DE },
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
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appConfigProvider = TestBed.inject(AppConfigProvider);
    store$ = TestBed.inject(MockStore);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get the selectVersionNumber and selectEmployeeName from store on init', () => {
      const spy = spyOn(store$, 'select').and.returnValue(of());
      component.ngOnInit();
      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy.calls.allArgs()).toEqual([
        [selectVersionNumber],
        [selectEmployeeName],
        [selectEmployeeId],
        [selectRole],
      ]);
    });
  });
  describe('ionViewWillEnter', () => {
    it('should set todaysDate and todaysDateFormatted on view will enter', () => {
      spyOn(BasePageComponent.prototype, 'ionViewWillEnter');
      component.ionViewWillEnter();
      expect(component.todaysDate).toEqual(new DateTime('2019-02-01'));
      expect(component.todaysDateFormatted).toEqual('Friday 1st February 2019');
    });
  });

  describe('showTestReportPracticeMode', () => {
    it('should return true when enableTestReportPracticeMode is true', () => {
      expect(component.showTestReportPracticeMode()).toEqual(true);
    });
    it('should return false when enableTestReportPracticeMode is not true', () => {
      spyOn(appConfigProvider, 'getAppConfig').and.returnValue({
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
      spyOn(appConfigProvider, 'getAppConfig').and.returnValue({
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
      spyOn(appConfigProvider, 'getAppConfig').and.returnValue({ role: ExaminerRole.DLG } as AppConfig);
      expect(component.showDelegatedExaminerRekey()).toEqual(true);
    });
  });
});

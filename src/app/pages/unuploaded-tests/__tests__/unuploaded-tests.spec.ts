import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteMock } from '@mocks/angular-mocks/activated-route.mock';
import { Store, StoreModule } from '@ngrx/store';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRoleDescription } from '@providers/app-config/constants/examiner-role.constants';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { OrientationMonitorProviderMock } from '@providers/orientation-monitor/__mocks/orientation-monitor.provider.mock';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { SlotProvider } from '@providers/slot/slot';
import { UnuploadedTestsViewDidEnter } from '../unuploaded-tests.actions';
import { UnuploadedTestsPage } from '../unuploaded-tests.page';

describe('UnuploadedTestsPage', () => {
  let component: UnuploadedTestsPage;
  let fixture: ComponentFixture<UnuploadedTestsPage>;
  let store$: jasmine.SpyObj<Store<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [UnuploadedTestsPage],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteMock },
        { provide: LogHelper, useValue: LogHelperMock },
        { provide: AuthenticationProvider, useValue: AuthenticationProviderMock },
        { provide: DeviceProvider, useValue: DeviceProviderMock },
        { provide: AppConfigProvider, useValue: AppConfigProviderMock },
        { provide: DateTimeProvider, useValue: DateTimeProviderMock },
        { provide: SlotProvider, useValue: SlotProviderMock },
        { provide: OrientationMonitorProvider, useValue: OrientationMonitorProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UnuploadedTestsPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store) as jasmine.SpyObj<Store<any>>;
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch UnuploadedTestsViewDidEnter action', async () => {
      spyOn(component.store$, 'dispatch').and.callThrough();
      await component.ionViewDidEnter();
      expect(store$.dispatch).toHaveBeenCalledWith(UnuploadedTestsViewDidEnter());
    });
  });

  describe('goToDashboard', () => {
    it('should navigate back to the dashboard page', () => {
      spyOn(component.router, 'navigate').and.callThrough();
      component.goToDashboard();
      expect(component.router.navigate).toHaveBeenCalledWith([DASHBOARD_PAGE], { replaceUrl: true });
    });
  });

  describe('getRoleDisplayValue', () => {
    it('should return the correct role description for a valid role', () => {
      const role = 'LDTM';
      expect(component.getRoleDisplayValue(role)).toBe(ExaminerRoleDescription[role]);
    });

    it('should return "Unknown Role" for an invalid role', () => {
      const role = 'INVALID_ROLE';
      expect(component.getRoleDisplayValue(role)).toBe('Unknown Role');
    });
  });

  describe('getEmployeeNumberDisplayValue', () => {
    it('should return the employee number if it is defined', () => {
      const employeeNumber = '12345';
      expect(component.getEmployeeNumberDisplayValue(employeeNumber)).toBe(employeeNumber);
    });

    it('should return "NOT_KNOWN" if the employee number is undefined', () => {
      expect(component.getEmployeeNumberDisplayValue(undefined)).toBe('NOT_KNOWN');
    });
  });

  describe('getTestsText', () => {
    it('should return "test" if the number of tests is 1', () => {
      expect(component.getTestsText(1)).toBe('test');
    });

    it('should return "tests" if the number of tests is greater than 1', () => {
      expect(component.getTestsText(2)).toBe('tests');
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ActivatedRouteMock } from '@mocks/angular-mocks/activated-route.mock';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { StorageMock } from '@mocks/ionic-mocks/storage.mock';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { PipesModule } from '@shared/pipes/pipes.module';
import { of } from 'rxjs';
import { RekeySearchPage } from '../rekey-search';

describe('RekeySearchPage', () => {
  let fixture: ComponentFixture<RekeySearchPage>;
  let component: RekeySearchPage;
  let store$: Store;

  beforeEach(async () => {
    const appConfigProviderMock = {
      getAppConfig: jasmine.createSpy('getAppConfig').and.returnValue({ role: ExaminerRole.LDTM }),
    };

    const orientationMonitorProviderMock = {
      monitorOrientation: jasmine.createSpy('monitorOrientation').and.returnValue(Promise.resolve()),
      tearDownListener: jasmine.createSpy('tearDownListener').and.returnValue(Promise.resolve()),
    };

    const networkStateProviderMock = {
      isOffline$: of(false),
    };

    await TestBed.configureTestingModule({
      declarations: [RekeySearchPage],
      imports: [StoreModule.forRoot({}), TranslateModule.forRoot(), PipesModule],
      providers: [
        {
          provide: AppConfigProvider,
          useValue: appConfigProviderMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: OrientationMonitorProvider,
          useValue: orientationMonitorProviderMock,
        },
        {
          provide: NetworkStateProvider,
          useValue: networkStateProviderMock,
        },
        {
          provide: Storage,
          useClass: StorageMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RekeySearchPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('applicationReferenceChanged', () => {
    it('should handle applicationReferenceChanged event', () => {
      const newValue = '12345';
      component.applicationReferenceChanged(newValue);
      expect(component.applicationReference).toBe(newValue);
    });
  });

  describe('staffNumberChanged', () => {
    it('should handle staffNumberChanged event', () => {
      const newValue = '67890';
      component.staffNumberChanged(newValue);
      expect(component.staffNumber).toBe(newValue);
    });
  });

  describe('disableSearch', () => {
    it('should disable search if applicationReference is empty or staffNumber is empty and not LDTM', () => {
      component.isLDTM = false;
      expect(component.disableSearch('', '12345', component.isLDTM)).toBeTrue();
      expect(component.disableSearch('12345', '', component.isLDTM)).toBeTrue();
      expect(component.disableSearch('12345', '67890', component.isLDTM)).toBeFalse();
    });

    it('should disable search if applicationReference is empty or staffNumber is empty and not LDTM', () => {
      component.isLDTM = true;
      expect(component.disableSearch('', '12345', component.isLDTM)).toBeTrue();
      expect(component.disableSearch('12345', '', component.isLDTM)).toBeFalse();
      expect(component.disableSearch('12345', '67890', component.isLDTM)).toBeFalse();
    });
  });
});

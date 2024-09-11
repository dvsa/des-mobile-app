import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { IonicModule, NavController, NavParams, Platform } from '@ionic/angular';
import { NavControllerMock, NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceAuthenticationProviderMock } from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import {
  ChangeStartEndTimeModal
} from '@pages/pass-finalisation/cat-adi-part3/components/change-start-end-time-modal/change-start-end-time-modal';

describe('ChangeStartEndTimeModal', () => {
  let fixture: ComponentFixture<ChangeStartEndTimeModal>;
  let component: ChangeStartEndTimeModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeStartEndTimeModal],
      imports: [IonicModule, AppModule],
      providers: [
        { provide: NavController, useClass: NavControllerMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: DeviceAuthenticationProvider, useClass: DeviceAuthenticationProviderMock },
      ],
    });

    fixture = TestBed.createComponent(ChangeStartEndTimeModal);
    component = fixture.componentInstance;
    component.onConfirm = jasmine.createSpy('onConfirm');
    component.onCancel = jasmine.createSpy('onCancel');
  }));

  describe('Class', () => {

  });
});

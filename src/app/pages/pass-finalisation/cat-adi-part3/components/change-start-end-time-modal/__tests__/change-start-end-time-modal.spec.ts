import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { IonicModule, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { NavControllerMock, NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { ChangeStartEndTimeModal } from '@pages/pass-finalisation/cat-adi-part3/components/change-start-end-time-modal/change-start-end-time-modal';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceAuthenticationProviderMock } from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';

xdescribe('ChangeStartEndTimeModal', () => {
  let fixture: ComponentFixture<ChangeStartEndTimeModal>;
  let component: ChangeStartEndTimeModal;
  let modalController: ModalController;

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
    modalController = TestBed.inject(ModalController);
    const modalSpy = jasmine.createSpyObj('Modal', ['dismiss']);
    // Mock the modalController to return the modalSpy
    spyOn(modalController, 'getTop').and.returnValue(Promise.resolve(modalSpy));
  }));

  describe('Class', () => {
    describe('onCancel', async () => {
      it('should dismiss the modal without data when onCancel is called', async () => {
        spyOn(modalController, 'dismiss').and.callThrough();
        await component.onCancel();
        expect(modalController.dismiss).toHaveBeenCalledWith();
      });
    });

    describe('onConfirm', async () => {
      it('should dismiss the modal with start and end time when onConfirm is called', async () => {
        component.startTime = '09:00';
        component.endTime = '17:00';
        spyOn(modalController, 'dismiss').and.callThrough();
        await component.onConfirm();
        expect(modalController.dismiss).toHaveBeenCalledWith({ startTime: '09:00', endTime: '17:00' });
      });
    });

    describe('changeFocusToEndTime', async () => {
      it('should focus the hour input of the end time picker when changeFocusToEndTime is called', async () => {
        component.endTimePicker = jasmine.createSpyObj('TimePickerComponent', ['focusHourInput']);
        component.changeFocusToEndTime();
        expect(component.endTimePicker.focusHourInput).toHaveBeenCalledWith(true);
      });
    });
  });
});

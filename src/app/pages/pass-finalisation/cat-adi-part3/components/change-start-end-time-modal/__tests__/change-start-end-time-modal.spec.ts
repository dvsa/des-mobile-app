import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonicModule, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { ModalControllerMock, NavControllerMock, NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { ChangeStartEndTimeModal } from '@pages/pass-finalisation/cat-adi-part3/components/change-start-end-time-modal/change-start-end-time-modal';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceAuthenticationProviderMock } from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { MockComponent } from 'ng-mocks';

describe('ChangeStartEndTimeModal', () => {
  let fixture: ComponentFixture<ChangeStartEndTimeModal>;
  let component: ChangeStartEndTimeModal;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeStartEndTimeModal],
      imports: [IonicModule, MockComponent(ModalAlertTitleComponent), AppModule],
      providers: [
        { provide: NavController, useClass: NavControllerMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: DeviceAuthenticationProvider, useClass: DeviceAuthenticationProviderMock },
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(ChangeStartEndTimeModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    const modalSpy = jasmine.createSpyObj('Modal', ['dismiss']);
    // Mock the modalController to return the modalSpy
    spyOn(modalController, 'getTop').and.returnValue(Promise.resolve(modalSpy));
  });

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should focus the modal container when modal is fully visible', async () => {
        component.modalContainer = jasmine.createSpyObj('ElementRef', ['nativeElement']);
        component.modalContainer.nativeElement = jasmine.createSpyObj('nativeElement', ['focus']);
        await component.ionViewDidEnter();
        expect(component.modalContainer.nativeElement.focus).toHaveBeenCalled();
      });
    });

    describe('invalid', () => {
      it('should return true if startTime is after endTime', () => {
        component.startTime = '2000-01-01T18:00';
        component.endTime = '2000-01-01T09:00';
        expect(component.invalid()).toBeTrue();
      });

      it('should return false if startTime is before endTime', () => {
        component.startTime = '2000-01-01T09:00';
        component.endTime = '2000-01-01T18:00';
        expect(component.invalid()).toBeFalse();
      });

      it('should return false if startTime equals endTime', () => {
        component.startTime = '2000-01-01T12:00';
        component.endTime = '2000-01-01T12:00';
        expect(component.invalid()).toBeFalse();
      });
    });

    describe('changeFocusToStartTime', () => {
      it('should focus the minute input of the start time picker with erase and selectHour true', async () => {
        component.startTimePicker = jasmine.createSpyObj('TimePickerComponent', ['focusMinuteInput']);
        await component.changeFocusToStartTime(true);
        expect(component.startTimePicker.focusMinuteInput).toHaveBeenCalledWith(true, true);
      });
    });

    describe('loopFocusToStartTime', () => {
      it('should prevent default event and focus hour input of start time picker', async () => {
        const event = jasmine.createSpyObj('Event', ['preventDefault']);
        component.startTimePicker = jasmine.createSpyObj('TimePickerComponent', ['focusHourInput']);
        await component.loopFocusToStartTime(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.startTimePicker.focusHourInput).toHaveBeenCalledWith(false, true);
      });

      it('should focus hour input of start time picker if event is null', async () => {
        component.startTimePicker = jasmine.createSpyObj('TimePickerComponent', ['focusHourInput']);
        await component.loopFocusToStartTime(null);
        expect(component.startTimePicker.focusHourInput).toHaveBeenCalledWith(false, true);
      });
    });

    describe('changeFocusToButtons', () => {
      it('should focus the cancel button', () => {
        component.cancelButton = jasmine.createSpyObj('ElementRef', ['nativeElement']);
        component.cancelButton.nativeElement = jasmine.createSpyObj('nativeElement', ['focus']);
        component.changeFocusToButtons();
        expect(component.cancelButton.nativeElement.focus).toHaveBeenCalled();
      });
    });
    describe('onCancel', async () => {
      it('should dismiss the modal without data when onCancel is called', async () => {
        spyOn(modalController, 'dismiss').and.resolveTo(true);
        await component.onCancel();
        expect(modalController.dismiss).toHaveBeenCalledWith();
      });
    });

    describe('onConfirm', async () => {
      it('should dismiss the modal with start and end time when onConfirm is called', async () => {
        component.startTime = '09:00';
        component.endTime = '17:00';
        spyOn(modalController, 'dismiss').and.resolveTo(true);
        await component.onConfirm();
        expect(modalController.dismiss).toHaveBeenCalledWith({ startTime: '09:00', endTime: '17:00' });
      });
    });

    describe('changeFocusToEndTime', async () => {
      it('should focus the hour input of the end time picker when changeFocusToEndTime is called', async () => {
        component.endTimePicker = jasmine.createSpyObj('TimePickerComponent', ['focusHourInput']);
        await component.changeFocusToEndTime(true);
        expect(component.endTimePicker.focusHourInput).toHaveBeenCalledWith(true);
      });
    });
  });
});

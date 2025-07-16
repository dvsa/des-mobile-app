import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonicModule, NavController, NavParams, Platform } from '@ionic/angular';
import { NavControllerMock, NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { TestStartEndTimesComponent } from '@pages/pass-finalisation/cat-adi-part3/components/test-start-end-times/test-start-end-times';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceAuthenticationProviderMock } from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { MockComponent } from 'ng-mocks';

describe('TestStartEndTimesComponent', () => {
  let fixture: ComponentFixture<TestStartEndTimesComponent>;
  let component: TestStartEndTimesComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestStartEndTimesComponent],
      imports: [IonicModule, MockComponent(ModalAlertTitleComponent), AppModule],
      providers: [
        { provide: NavController, useClass: NavControllerMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: DeviceAuthenticationProvider, useClass: DeviceAuthenticationProviderMock },
      ],
    });

    fixture = TestBed.createComponent(TestStartEndTimesComponent);
    component = fixture.componentInstance;
  }));

  describe('modalTimeChanged', () => {
    it('should emit start and end time changes when called with event', () => {
      spyOn(component.testStartTimeChange, 'emit');
      spyOn(component.testEndTimeChange, 'emit');
      const event = { startTime: '09:00', endTime: '17:00' };
      component.modalTimeChanged(event);
      expect(component.testStartTimeChange.emit).toHaveBeenCalledWith('09:00');
      expect(component.testEndTimeChange.emit).toHaveBeenCalledWith('17:00');
    });

    it('should not emit any changes when called with null', () => {
      spyOn(component.testStartTimeChange, 'emit');
      spyOn(component.testEndTimeChange, 'emit');
      component.modalTimeChanged(null);
      expect(component.testStartTimeChange.emit).not.toHaveBeenCalled();
      expect(component.testEndTimeChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const formatted = component.formatTime('2024-06-01T09:15:00Z');
      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('findDifferenceInTime', () => {
    it('should find the correct difference in minutes between two times', () => {
      const diff = component.findDifferenceInTime('2024-06-01T09:00:00Z', '2024-06-01T09:30:00Z');
      expect(diff).toBe(30);
    });
  });

  describe('selectedValueChanged', () => {
    it('should emit confirmStartAndEndTime event when called', () => {
      spyOn(component.confirmStartAndEndTime, 'emit');
      component.selectedValueChanged(true);
      expect(component.confirmStartAndEndTime.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('openTimeEditModal', () => {
    it('should open modal and emit time changes when called', async () => {
      const modalSpy = jasmine.createSpyObj('modal', ['present', 'onDidDismiss']);
      modalSpy.present.and.returnValue(Promise.resolve());
      modalSpy.onDidDismiss.and.returnValue(Promise.resolve({ data: { startTime: '10:00', endTime: '11:00' } }));
      spyOn(component.modalController, 'create').and.returnValue(Promise.resolve(modalSpy));
      spyOn(component, 'modalTimeChanged');
      await component.openTimeEditModal();
      expect(component.modalController.create).toHaveBeenCalled();
      expect(modalSpy.present).toHaveBeenCalled();
      expect(component.modalTimeChanged).toHaveBeenCalledWith({ startTime: '10:00', endTime: '11:00' });
    });
  });
});

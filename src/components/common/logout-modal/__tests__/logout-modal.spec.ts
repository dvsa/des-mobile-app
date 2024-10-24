import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { BehaviorSubject } from 'rxjs';
import { LogoutModal, LogoutModalEvent } from '../logout-modal';

describe('LogoutModal', () => {
  let fixture: ComponentFixture<LogoutModal>;
  let component: LogoutModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LogoutModal],
      imports: [IonicModule, AppModule],
      providers: [ModalController],
    });

    fixture = TestBed.createComponent(LogoutModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
  }));

  describe('onCancel', () => {
    it('should dismiss the modal with CANCEL event', async () => {
      spyOn(component.modalController, 'dismiss').and.resolveTo(true);
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith({ event: LogoutModalEvent.CANCEL });
    });
  });

  describe('getUnsubmittedTestsCount', () => {
    it('should return the correct count of completed tests', () => {
      const testStatuses = new BehaviorSubject<{ [slotId: string]: TestStatus }>({
        '1': TestStatus.Completed,
        '2': TestStatus.Completed,
        '3': TestStatus.Submitted,
      });
      component.testStatuses = testStatuses.asObservable();
      const count = component.getUnsubmittedTestsCount();
      expect(count).toBe(2);
    });

    it('should return zero when there are no completed tests', () => {
      const testStatuses = new BehaviorSubject<{ [slotId: string]: TestStatus }>({
        '1': TestStatus.Submitted,
        '2': TestStatus.Submitted,
      });
      component.testStatuses = testStatuses.asObservable();

      const count = component.getUnsubmittedTestsCount();

      expect(count).toBe(0);
    });

    it('should return zero when testStatuses is empty', () => {
      const testStatuses = new BehaviorSubject<{ [slotId: string]: TestStatus }>({});
      component.testStatuses = testStatuses.asObservable();

      const count = component.getUnsubmittedTestsCount();

      expect(count).toBe(0);
    });
  });

  describe('onLogout', () => {
    it('should dismiss the modal with LOGOUT event', async () => {
      spyOn(modalController, 'dismiss').and.resolveTo(true);
      await component.onLogout();
      expect(modalController.dismiss).toHaveBeenCalledWith({ event: LogoutModalEvent.LOGOUT });
    });
  });
});

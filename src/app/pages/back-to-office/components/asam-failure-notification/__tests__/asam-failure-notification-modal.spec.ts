import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { MockComponent } from 'ng-mocks';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { AsamFailureNotificationModal } from '../asam-failure-notification-modal';

describe('AsamFailureNotificationModal', () => {
  let component: AsamFailureNotificationModal;
  let fixture: ComponentFixture<AsamFailureNotificationModal>;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AsamFailureNotificationModal,
        MockComponent(ModalAlertTitleComponent),
      ],
      imports: [
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(AsamFailureNotificationModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    spyOn(modalController, 'dismiss');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCompleteTest', () => {
    it('should dismiss modal', async () => {
      await component.onCompleteTest();
      expect(modalController.dismiss).toHaveBeenCalled();
    });
  });
});

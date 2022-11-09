import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { MockComponent } from 'ng-mocks';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { AsamFailureNotificationModal } from '../asam-failure-notification-modal';

fdescribe('AsamFailureNotificationModal', () => {
  let component: AsamFailureNotificationModal;
  let fixture: ComponentFixture<AsamFailureNotificationModal>;

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
    spyOn(component.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

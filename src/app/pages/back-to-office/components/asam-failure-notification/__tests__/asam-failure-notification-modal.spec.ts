import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { configureTestSuite } from 'ng-bullet';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { AsamFailureNotificationModal } from '../asam-failure-notification-modal';

describe('AsamFailureNotificationModal', () => {
  let component: AsamFailureNotificationModal;
  let fixture: ComponentFixture<AsamFailureNotificationModal>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        AsamFailureNotificationModal,
      ],
      imports: [
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });
  });
  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(AsamFailureNotificationModal);
    component = fixture.componentInstance;
    spyOn(component.modalController, 'dismiss')
      .and
      .returnValue(Promise.resolve(true));
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });
});

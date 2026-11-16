import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { MockComponent } from 'ng-mocks';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AsamFailureNotificationModal } from '../asam-failure-notification-modal';

describe('AsamFailureNotificationModal', () => {
  let component: AsamFailureNotificationModal;
  let fixture: ComponentFixture<AsamFailureNotificationModal>;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AsamFailureNotificationModal, MockComponent(ModalAlertTitleComponent)],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(AsamFailureNotificationModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    vi.spyOn(modalController, 'dismiss').mockReturnValue(undefined);
  });

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

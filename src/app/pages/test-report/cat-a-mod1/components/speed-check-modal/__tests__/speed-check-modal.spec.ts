import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { SpeedCheckModal } from '../speed-check-modal';

describe('SpeedCheckModal', () => {
  let fixture: ComponentFixture<SpeedCheckModal>;
  let component: SpeedCheckModal;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpeedCheckModal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(SpeedCheckModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    vi.spyOn(modalController, 'dismiss').mockReturnValue(Promise.resolve(true));
  });

  describe('onCancel', () => {
    it('should call dismiss with the CANCEL event', async () => {
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
  describe('onTerminate', () => {
    it('should call dismiss with the TERMINATE event', async () => {
      await component.onTerminate();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.TERMINATE);
    });
  });

  describe('DOM', () => {
    it('should call onCancel when the Return to test button is clicked', () => {
      component.speedChecksNeedCompleting = [];
      fixture.detectChanges();
      vi.spyOn(component, 'onCancel').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.modal-return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should call onTerminate when the Terminate test button is clicked', () => {
      component.speedChecksNeedCompleting = [];
      fixture.detectChanges();
      vi.spyOn(component, 'onTerminate').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.terminate-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onTerminate).toHaveBeenCalled();
    });
  });
});

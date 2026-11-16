import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { ModalEvent } from '@pages/dashboard/components/practice-test-modal/practice-test-modal.constants';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EtaInvalidModal } from '../eta-invalid-modal';

describe('EtaInvalidModal', () => {
  let fixture: ComponentFixture<EtaInvalidModal>;
  let component: EtaInvalidModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EtaInvalidModal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(EtaInvalidModal);
    component = fixture.componentInstance;
  });

  describe('DOM', () => {
    it('should call onCancel when the Return to test button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onCancel').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.modal-return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
  });
  describe('onCancel', () => {
    it('should invoke the correct event when modalController is dismissed - cancel', async () => {
      vi.spyOn(component.modalCtrl, 'dismiss').mockReturnValue(undefined);
      await component.onCancel();
      expect(component.modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
});

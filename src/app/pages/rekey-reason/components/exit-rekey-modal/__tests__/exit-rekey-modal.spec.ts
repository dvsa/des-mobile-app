import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ExitRekeyModal } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal';
import { ExitRekeyModalEvent } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal.constants';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ExitRekeyModal', () => {
  let fixture: ComponentFixture<ExitRekeyModal>;
  let component: ExitRekeyModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExitRekeyModal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(ExitRekeyModal);
    component = fixture.componentInstance;
    vi.spyOn(component.modalCtrl, 'dismiss').mockReturnValue(undefined);
  });

  describe('DOM', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
  describe('onCancel', () => {
    it('should invoke the correct event when modalController is dismissed - cancel', async () => {
      await component.onCancel();
      expect(component.modalCtrl.dismiss).toHaveBeenCalledWith(ExitRekeyModalEvent.CANCEL);
    });
  });
  describe('onExitRekey', () => {
    it('should invoke the correct event when modalController is dismissed - exitRekey', async () => {
      await component.onExitRekey();
      expect(component.modalCtrl.dismiss).toHaveBeenCalledWith(ExitRekeyModalEvent.EXIT_REKEY);
    });
  });
});

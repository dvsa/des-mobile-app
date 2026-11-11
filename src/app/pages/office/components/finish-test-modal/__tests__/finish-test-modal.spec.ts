import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinishTestModal', () => {
  let modalFixture: ComponentFixture<FinishTestModal>;
  let modalComponent: FinishTestModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, FinishTestModal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    modalFixture = TestBed.createComponent(FinishTestModal);
    modalComponent = modalFixture.componentInstance;
    vi.spyOn(modalComponent.modalController, 'dismiss').mockReturnValue(Promise.resolve(true));
    modalComponent.completeTest = vi.fn();
    modalComponent.destroyTestSubs = vi.fn();
  });

  describe('onCompleteTest', () => {
    it('expect completeTest to be called', async () => {
      await modalComponent.onCompleteTest();
      expect(modalComponent.destroyTestSubs).toHaveBeenCalled();
      expect(modalComponent.completeTest).toHaveBeenCalled();
    });
  });

  describe('onBack', () => {
    it('expect modalController dismiss', async () => {
      await modalComponent.onBack();
      expect(modalComponent.modalController.dismiss).toHaveBeenCalled();
    });
  });
});

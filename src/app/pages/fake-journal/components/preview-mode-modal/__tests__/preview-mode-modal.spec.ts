import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalEvent } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal.constants';
import { PreviewModeModal } from '../preview-mode-modal';

describe('PreviewModeModal', () => {
  let fixture: ComponentFixture<PreviewModeModal>;
  let component: PreviewModeModal;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreviewModeModal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(PreviewModeModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    vi.spyOn(modalController, 'dismiss').mockReturnValue(undefined);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Class', () => {
    describe('onCancel', () => {
      it('should dismiss modal with `cancel` callback', async () => {
        await component.onCancel();
        expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
      });
    });
    describe('onContinue', () => {
      it('should dismiss modal with `start` callback', async () => {
        await component.onContinue();
        expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.START);
      });
    });
  });

  describe('DOM', () => {
    it('should call onCancel when the Cancel button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onCancel').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('#preview-mode-return-to-journal-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
    it('should call onContinue when the Continue button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onContinue').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('#preview-mode-continue-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onContinue).toHaveBeenCalled();
    });
  });
});

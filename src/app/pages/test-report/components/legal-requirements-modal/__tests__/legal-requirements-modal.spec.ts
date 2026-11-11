import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModalEvent } from '../../../test-report.constants';
import { LegalRequirementsModal } from '../legal-requirements-modal';

describe('LegalRequirementsModal', () => {
  let fixture: ComponentFixture<LegalRequirementsModal>;
  let component: LegalRequirementsModal;
  let modalCtrl: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LegalRequirementsModal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(LegalRequirementsModal);
    component = fixture.componentInstance;
    modalCtrl = TestBed.inject(ModalController);
  });

  describe('DOM', () => {
    it('should call onCancel when the Return to test button is clicked', () => {
      component.legalRequirements = [];
      fixture.detectChanges();
      vi.spyOn(component, 'onCancel').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.modal-return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should call onTerminate when the Terminate test button is clicked', () => {
      component.legalRequirements = [];
      fixture.detectChanges();
      vi.spyOn(component, 'onTerminate').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.terminate-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onTerminate).toHaveBeenCalled();
    });
  });
  describe('onCancel', () => {
    it('should call dismiss with CANCEL', async () => {
      vi.spyOn(modalCtrl, 'dismiss').mockReturnValue(undefined);
      await component.onCancel();
      expect(await modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
  describe('onContinue', () => {
    it('should call dismiss with CONTINUE', async () => {
      vi.spyOn(modalCtrl, 'dismiss').mockReturnValue(undefined);
      await component.onContinue();
      expect(await modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.CONTINUE);
    });
  });
  describe('onTerminate', () => {
    it('should call dismiss with TERMINATE', async () => {
      vi.spyOn(modalCtrl, 'dismiss').mockReturnValue(undefined);
      await component.onTerminate();
      expect(await modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.TERMINATE);
    });
  });
});

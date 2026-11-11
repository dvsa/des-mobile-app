import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SpecialLegalRequirementModal } from '../special-legal-requirement-modal';

describe('LegalRequirementsModal', () => {
  let fixture: ComponentFixture<SpecialLegalRequirementModal>;
  let component: SpecialLegalRequirementModal;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpecialLegalRequirementModal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(SpecialLegalRequirementModal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
    vi.spyOn(component.modalCtrl, 'dismiss').mockReturnValue(undefined);
  });

  describe('DOM', () => {
    it('should call onCancel when the Return to test button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onCancel').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should call onTerminate when the Terminate test button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onTerminate').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.terminate-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onTerminate).toHaveBeenCalled();
    });

    it('should call onProceed when the Continue test button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onProceed').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('.mes-primary-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onProceed).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should dismiss the view controller with cancel event', async () => {
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
  describe('onProceed', () => {
    it('should dismiss the view controller with continue event', async () => {
      await component.onProceed();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CONTINUE);
    });
  });
  describe('onTerminate', () => {
    it('should dismiss the view controller with terminate event', async () => {
      await component.onTerminate();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.TERMINATE);
    });
  });
});

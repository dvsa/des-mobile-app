import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { MockComponent } from 'ng-mocks';
import { PracticeModeMOTModal } from '../practice-mode-mot-modal.component';

describe('PracticeModeMOTModal', () => {
  let component: PracticeModeMOTModal;
  let fixture: ComponentFixture<PracticeModeMOTModal>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PracticeModeMOTModal, MockComponent(ModalAlertTitleComponent)],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticeModeMOTModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should initialize formControl and add it to formGroup on ngOnInit', () => {
      component.ngOnInit();
      expect(component.formControl).toBeTruthy();
      expect(component.form.contains('motPracticeOutcome')).toBe(true);
    });

    it('should dismiss modal with formControl value when onConfirm is called and form is valid', async () => {
      vi.spyOn(component.modalCtrl, 'dismiss').mockReturnValue(undefined);
      component.ngOnInit();
      component.formControl.setValue('pass');
      await component.onConfirm();
      expect(component.modalCtrl.dismiss).toHaveBeenCalledWith('pass');
    });
  });

  describe('onConfirm', () => {
    it('should not dismiss modal when onConfirm is called and form is invalid', async () => {
      vi.spyOn(component.modalCtrl, 'dismiss').mockReturnValue(undefined);
      component.ngOnInit();
      component.formControl.setValue('');
      await component.onConfirm();
      expect(component.modalCtrl.dismiss).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should dismiss modal with CANCEL event when onCancel is called', async () => {
      vi.spyOn(component.modalCtrl, 'dismiss').mockReturnValue(undefined);
      await component.onCancel();
      expect(component.modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });

  describe('Invalid', () => {
    it('should return true for invalid getter when formControl is invalid and dirty', () => {
      component.ngOnInit();
      component.formControl.setValue('');
      component.formControl.markAsDirty();
      expect(component.invalid).toBe(true);
    });

    it('should return false for invalid getter when formControl is valid and dirty', () => {
      component.ngOnInit();
      component.formControl.setValue('pass');
      component.formControl.markAsDirty();
      expect(component.invalid).toBe(false);
    });

    it('should return false for invalid getter when formControl is invalid but not dirty', () => {
      component.ngOnInit();
      component.formControl.setValue('');
      expect(component.invalid).toBe(false);
    });
  });
});

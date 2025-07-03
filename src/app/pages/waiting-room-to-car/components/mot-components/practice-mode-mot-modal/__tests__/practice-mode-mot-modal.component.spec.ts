import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { MockComponent } from 'ng-mocks';
import { PracticeModeMOTModal } from '../practice-mode-mot-modal.component';

describe('PracticeModeMOTModal', () => {
  let component: PracticeModeMOTModal;
  let fixture: ComponentFixture<PracticeModeMOTModal>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeModeMOTModal, MockComponent(ModalAlertTitleComponent)],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticeModeMOTModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should initialize formControl and add it to formGroup on ngOnInit', () => {
      component.ngOnInit();
      expect(component.formControl).toBeTruthy();
      expect(component.form.contains('motPracticeOutcome')).toBeTrue();
    });

    it('should dismiss modal with formControl value when onConfirm is called and form is valid', async () => {
      spyOn(component.modalCtrl, 'dismiss');
      component.ngOnInit();
      component.formControl.setValue('pass');
      await component.onConfirm();
      expect(component.modalCtrl.dismiss).toHaveBeenCalledWith('pass');
    });
  });

  describe('onConfirm', () => {
    it('should not dismiss modal when onConfirm is called and form is invalid', async () => {
      spyOn(component.modalCtrl, 'dismiss');
      component.ngOnInit();
      component.formControl.setValue('');
      await component.onConfirm();
      expect(component.modalCtrl.dismiss).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should dismiss modal with CANCEL event when onCancel is called', async () => {
      spyOn(component.modalCtrl, 'dismiss');
      await component.onCancel();
      expect(component.modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });

  describe('Invalid', () => {
    it('should return true for invalid getter when formControl is invalid and dirty', () => {
      component.ngOnInit();
      component.formControl.setValue('');
      component.formControl.markAsDirty();
      expect(component.invalid).toBeTrue();
    });

    it('should return false for invalid getter when formControl is valid and dirty', () => {
      component.ngOnInit();
      component.formControl.setValue('pass');
      component.formControl.markAsDirty();
      expect(component.invalid).toBeFalse();
    });

    it('should return false for invalid getter when formControl is invalid but not dirty', () => {
      component.ngOnInit();
      component.formControl.setValue('');
      expect(component.invalid).toBeFalse();
    });
  });
});

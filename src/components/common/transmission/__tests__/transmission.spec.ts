import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TransmissionComponent } from '../transmission';

describe('TransmissionComponent', () => {
  let fixture: ComponentFixture<TransmissionComponent>;
  let component: TransmissionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TransmissionComponent],
    });

    fixture = TestBed.createComponent(TransmissionComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  });

  describe('ngOnChanges', () => {
    it('creates automatic confirm control when confirmation settings enabled and transmission is Automatic', () => {
      component.shouldShowConfirmationSettings = true;
      component.transmission = 'Automatic';
      component.shouldShowEditBox = false;
      component.autoConfirmSelected = true;
      vi.spyOn(component.automaticConfirmChange, 'emit').mockReturnValue(undefined);
      component.ngOnChanges();
      const ctrl = component.formGroup.get(component.autoConfirmFieldName);
      expect(ctrl).toBeTruthy();
      expect(component.autoCheckboxFormControl).toBeTruthy();
      expect(component.automaticConfirmChange.emit).toHaveBeenCalledWith(component.autoConfirmSelected);
    });

    it('does not create automatic confirm control when confirmation settings disabled', () => {
      component.shouldShowConfirmationSettings = false;
      component.transmission = 'Automatic';
      component.shouldShowEditBox = false;
      component.ngOnChanges();
      const ctrl = component.formGroup.get(component.autoConfirmFieldName);
      expect(ctrl).toBeNull();
      expect(component.autoCheckboxFormControl).toBeUndefined();
    });
  });

  describe('transmissionChanged', () => {
    it('removes automatic confirm control and emits undefined when transmission changed to Manual', () => {
      component.shouldShowConfirmationSettings = true;
      component.transmission = 'Automatic';
      component.shouldShowEditBox = false;
      component.ngOnChanges();
      vi.spyOn(component.automaticConfirmChange, 'emit').mockReturnValue(undefined);
      component.transmissionChanged('Manual');
      expect(component.formGroup.get(component.autoConfirmFieldName)).toBeNull();
      expect(component.autoCheckboxFormControl).toBeNull();
      expect(component.automaticConfirmChange.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('deactivateEditMode', () => {
    it('deactivateEditMode unchecks the checkbox control, updates state and emits false', () => {
      component.shouldShowConfirmationSettings = true;
      component.transmission = 'Automatic';
      component.shouldShowEditBox = false;
      component.autoConfirmSelected = true;
      component.ngOnChanges();
      vi.spyOn(component.automaticConfirmChange, 'emit').mockReturnValue(undefined);
      component.deactivateEditMode();
      const ctrl = component.formGroup.get(component.autoConfirmFieldName) as UntypedFormControl;
      expect(component.autoConfirmSelected).toBe(false);
      expect(ctrl.value).toBe(false);
      expect(component.automaticConfirmChange.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('automaticConfirmChanged', () => {
    it('automaticConfirmChanged sets isShowingEditBox to false and emits provided value', () => {
      vi.spyOn(component.automaticConfirmChange, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.userClickedEditButton, 'emit').mockReturnValue(undefined);
      component.automaticConfirmChanged(true);
      expect(component.automaticConfirmChange.emit).toHaveBeenCalledWith(true);
      expect(component.userClickedEditButton.emit).toHaveBeenCalled();
    });
  });

  describe('isAutoConfirmInvalid', () => {
    it('returns false when control is not present', () => {
      component.autoCheckboxFormControl = null;
      expect(component.isAutoConfirmInvalid()).toBe(false);
    });

    it('returns true when control is invalid and dirty', () => {
      component.shouldShowConfirmationSettings = true;
      component.transmission = 'Automatic';
      component.shouldShowEditBox = false;
      component.autoConfirmSelected = false;
      component.ngOnChanges();
      const ctrl = component.formGroup.get(component.autoConfirmFieldName) as UntypedFormControl;
      ctrl.markAsDirty();
      expect(component.isAutoConfirmInvalid()).toBe(true);
    });
  });
});

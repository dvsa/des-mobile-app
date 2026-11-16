import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { provideMockStore } from '@ngrx/store/testing';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { CircuitType } from '@shared/models/circuit-type';

describe('DebriefWitnessedComponent', () => {
  let fixture: ComponentFixture<DebriefWitnessedComponent>;
  let component: DebriefWitnessedComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DebriefWitnessedComponent],
      providers: [
        provideMockStore({ ...{} }),
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(DebriefWitnessedComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges', () => {
    it('should clear validators from FormControl if visibilityType is VisibilityType.NotVisible', () => {
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(DebriefWitnessedComponent.fieldName, component.formControl);
      component.formGroup.get(DebriefWitnessedComponent.fieldName).setValidators([Validators.required]);

      vi.spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').mockReturnValue(VisibilityType.NotVisible);
      component.ngOnChanges();

      expect(component.formGroup.get(DebriefWitnessedComponent.fieldName).hasValidator(Validators.required)).toBe(
        false
      );
    });
    it('should set validators to FormControl if visibilityType is not VisibilityType.NotVisible', () => {
      component.formGroup = new UntypedFormGroup({});

      vi.spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').mockReturnValue(VisibilityType.Visible);
      component.ngOnChanges();

      expect(component.formGroup.get(DebriefWitnessedComponent.fieldName).hasValidator(Validators.required)).toBe(true);
    });
    it('should patch null if debriefWitnessed is not null', () => {
      component.formGroup = new UntypedFormGroup({});
      component.debriefWitnessed = null;
      component.ngOnChanges();

      expect(component.formControl.value).toBe(null);
    });
  });

  describe('debriefWitnessedChanged', () => {
    it('should emit debriefWitnessedFormValue while from control is valid', () => {
      vi.spyOn(component.debriefWitnessedChange, 'emit').mockReturnValue(undefined);
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(1);

      component.debriefWitnessedChanged('debrief-witnessed-yes');
      expect(component.debriefWitnessedChange.emit).toHaveBeenCalledWith(true);
    });
    it('should not emit debriefWitnessedFormValue while from control is not valid', () => {
      vi.spyOn(component.debriefWitnessedChange, 'emit').mockReturnValue(undefined);
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(null);

      component.debriefWitnessedChanged('debrief-witnessed-yes');
      expect(component.debriefWitnessedChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(DebriefWitnessedComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(DebriefWitnessedComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(DebriefWitnessedComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(DebriefWitnessedComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });
});

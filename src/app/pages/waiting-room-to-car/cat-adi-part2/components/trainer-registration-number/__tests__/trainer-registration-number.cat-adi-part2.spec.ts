import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TrainerRegistrationNumberCatAdiPart2Component } from '../trainer-registration-number.cat-adi-part2';
import {
  mockBlankTrainerRegNumber,
  mockInvalidTrainerRegNumber,
  mockLeadingZeroTrainerRegNumber,
  mockOnlyZeroTrainerRegNumber,
  mockValidTrainerRegNumber,
} from './trainer-registration-number.mock';

describe('TrainerRegistrationNumberCatAdiPart2Component', () => {
  let fixture: ComponentFixture<TrainerRegistrationNumberCatAdiPart2Component>;
  let component: TrainerRegistrationNumberCatAdiPart2Component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerRegistrationNumberCatAdiPart2Component],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(TrainerRegistrationNumberCatAdiPart2Component);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);
  });

  describe('ngOnChanges', () => {
    it('should have trainerRegistration form control be added to form if there is no form control already there', () => {
      component.formControl = null;
      component.ngOnChanges();

      expect(component.formGroup.controls[TrainerRegistrationNumberCatAdiPart2Component.fieldName]).toBeTruthy();
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });

  describe('trainerRegistrationChanged', () => {
    beforeEach(() => {
      spyOn(component.trainerRegistrationChange, 'emit');
    });

    it('should recognise a valid numeric string and emit the value as a number', () => {
      component.trainerRegistrationChanged(mockValidTrainerRegNumber);
      expect(component.trainerRegistrationChange.emit).toHaveBeenCalledWith(1234567);
    });

    it('should emit NaN for a string containing non-numeric characters', () => {
      component.trainerRegistrationChanged(mockInvalidTrainerRegNumber);
      expect(component.trainerRegistrationChange.emit).toHaveBeenCalledWith(Number.NaN);
    });

    it('should emit the numeric value, stripping leading zeros via Number()', () => {
      component.trainerRegistrationChanged(mockLeadingZeroTrainerRegNumber);
      expect(component.trainerRegistrationChange.emit).toHaveBeenCalledWith(4567);
    });

    it('should emit 0 for a string containing only zero', () => {
      component.trainerRegistrationChanged(mockOnlyZeroTrainerRegNumber);
      expect(component.trainerRegistrationChange.emit).toHaveBeenCalledWith(0);
    });

    it('should emit 0 for an empty string', () => {
      component.trainerRegistrationChanged(mockBlankTrainerRegNumber);
      expect(component.trainerRegistrationChange.emit).toHaveBeenCalledWith(0);
    });
  });
});

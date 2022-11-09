import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';

import { TrainerRegistrationNumberCatAdiPart2Component } from '../trainer-registration-number.cat-adi-part2';
import {
  mockBlankTrainerRegNumber,
  mockInvalidTrainerRegNumber, mockLeadingZeroTrainerRegNumber,
  mockOnlyZeroTrainerRegNumber,
  mockValidTrainerRegNumber,
} from './trainer-registration-number.mock';

describe('TrainerRegistrationNumberCatAdiPart2Component', () => {
  let fixture: ComponentFixture<TrainerRegistrationNumberCatAdiPart2Component>;
  let component: TrainerRegistrationNumberCatAdiPart2Component;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TrainerRegistrationNumberCatAdiPart2Component,
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TrainerRegistrationNumberCatAdiPart2Component);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);
  }));

  describe('ngOnChanges', () => {
    it('should have trainerRegistration form control be added to '
        + 'form if there is no form control already there', () => {
      component.formControl = null;
      component.ngOnChanges();

      expect(component.formGroup.controls.trainerRegistration).toBeTruthy();
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

  describe('vehicleRegistrationChanged', () => {
    beforeEach(() => {
      spyOn(component.trainerRegistrationChange, 'emit');
    });

    it('should recognise a valid numeric string and emit the value as a number', () => {
      component.trainerRegistrationChanged(mockValidTrainerRegNumber);
      expect(component.trainerRegistrationChange.emit).toHaveBeenCalledWith(1234567);
    });

    it('should remove non-numeric characters and emit the value as number', () => {
      component.trainerRegistrationChanged(mockInvalidTrainerRegNumber);
      expect(component.trainerRegistrationChange.emit).toHaveBeenCalledWith(12457);
    });

    it('should remove preceding zeros and emit rest of valid result', () => {
      component.trainerRegistrationChanged(mockLeadingZeroTrainerRegNumber);
      expect(component.trainerRegistrationChange.emit).toHaveBeenCalledWith(4567);
    });

    it('should remove preceding zeros and emit undefined as empty', () => {
      component.trainerRegistrationChanged(mockOnlyZeroTrainerRegNumber);
      expect(component.trainerRegistrationChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should emit undefined as the value can`t be cast to a number', () => {
      component.trainerRegistrationChanged(mockBlankTrainerRegNumber);
      expect(component.trainerRegistrationChange.emit).toHaveBeenCalledWith(undefined);
    });
  });
});

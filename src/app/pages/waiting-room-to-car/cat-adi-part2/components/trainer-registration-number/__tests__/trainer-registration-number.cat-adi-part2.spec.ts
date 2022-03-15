import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
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

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TrainerRegistrationNumberCatAdiPart2Component);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.formControl = new FormControl(null);
  }));

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

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  UntypedFormControl, UntypedFormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { InstructorRegistrationComponent } from '../instructor-registration';
import {
  mockBlankInstructorRegistrationNumber,
  mockInvalidInstructorRegistrationNumber,
  mockLeadingZeroRegistrationNumber,
  mockOnlyZeroRegistrationNumber,
  mockValidInstructorRegistrationNumber,
} from './instructor-registration.mock';

describe('InstructorRegistrationComponent', () => {
  let fixture: ComponentFixture<InstructorRegistrationComponent>;
  let component: InstructorRegistrationComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        InstructorRegistrationComponent,
      ],
      imports: [
        IonicModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(InstructorRegistrationComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);
  }));

  describe('ngOnChanges', () => {
    it('should have instructorRegistration form control be added to '
        + 'form if there is no form control already there', () => {
      component.formControl = null;
      component.ngOnChanges();

      expect(component.formGroup.controls.instructorRegistration).toBeTruthy();
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
      spyOn(component.instructorRegistrationChange, 'emit');
    });

    it('should recognise a valid numeric string and emit the value as a number', () => {
      component.instructorRegistrationChanged(mockValidInstructorRegistrationNumber);
      expect(component.instructorRegistrationChange.emit).toHaveBeenCalledWith(1234567);
    });

    it('should remove non-numeric characters and emit the value as number', () => {
      component.instructorRegistrationChanged(mockInvalidInstructorRegistrationNumber);
      expect(component.instructorRegistrationChange.emit).toHaveBeenCalledWith(12457);
    });

    it('should remove preceding zeros and emit rest of valid result', () => {
      component.instructorRegistrationChanged(mockLeadingZeroRegistrationNumber);
      expect(component.instructorRegistrationChange.emit).toHaveBeenCalledWith(4567);
    });

    it('should remove preceding zeros and emit undefined as empty', () => {
      component.instructorRegistrationChanged(mockOnlyZeroRegistrationNumber);
      expect(component.instructorRegistrationChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should emit undefined as the value can`t be cast to a number', () => {
      component.instructorRegistrationChanged(mockBlankInstructorRegistrationNumber);
      expect(component.instructorRegistrationChange.emit).toHaveBeenCalledWith(undefined);
    });
  });
});

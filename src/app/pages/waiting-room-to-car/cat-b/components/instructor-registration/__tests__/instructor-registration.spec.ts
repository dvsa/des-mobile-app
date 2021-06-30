import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
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
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(InstructorRegistrationComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.formControl = new FormControl(null);
  }));

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

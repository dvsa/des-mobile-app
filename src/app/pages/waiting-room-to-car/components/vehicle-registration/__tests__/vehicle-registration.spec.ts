import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  UntypedFormControl, UntypedFormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { VehicleRegistrationComponent } from '../vehicle-registration';
import {
  mockBlankRegistrationNumber,
  mockInvalidRegistrationNumber,
  mockValidRegistrationNumber,
} from './vehicle-registration.mock';

describe('VehicleRegistrationComponent', () => {
  let fixture: ComponentFixture<VehicleRegistrationComponent>;
  let component: VehicleRegistrationComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleRegistrationComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleRegistrationComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);
  }));

  describe('ngOnChanges', () => {
    it('should have vehicleRegistration form control be added to '
        + 'form if there is no form control already there', () => {
      component.formControl = null;
      component.ngOnChanges();

      expect(component.formGroup.controls.vehicleRegistration).toBeTruthy();
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
      spyOn(component.vehicleRegistrationChange, 'emit');
      spyOn(component.formControl, 'setErrors');
    });

    it('should recognise a valid alphanumeric string and emit the value in uppercase', () => {
      component.vehicleRegistrationChanged(mockValidRegistrationNumber);
      expect(component.formControl.setErrors).not.toHaveBeenCalled();
      expect(component.vehicleRegistrationChange.emit).toHaveBeenCalledWith('ABC123');
    });

    it('should remove non-alphanumeric characters and emit the value in uppercase', () => {
      component.vehicleRegistrationChanged(mockInvalidRegistrationNumber);
      expect(component.formControl.setErrors).not.toHaveBeenCalled();
      expect(component.vehicleRegistrationChange.emit).toHaveBeenCalledWith('DEF23');
    });

    it('should set an error on form control as the field value is dirty and non compliant', () => {
      component.vehicleRegistrationChanged(mockBlankRegistrationNumber);
      expect(component.formControl.setErrors).toHaveBeenCalledWith({ invalidValue: '' });
      expect(component.vehicleRegistrationChange.emit).toHaveBeenCalledWith('');
    });
  });
});

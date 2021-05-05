import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { configureTestSuite } from 'ng-bullet';
import { VehicleRegistrationComponent } from '../vehicle-registration';
import { AppModule } from '../../../../../app/app.module';
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
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleRegistrationComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.formControl = new FormControl(null, [Validators.required]);
  }));

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

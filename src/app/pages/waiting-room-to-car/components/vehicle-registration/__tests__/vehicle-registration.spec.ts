import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AppModule } from '@app/app.module';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MotStatusCodes } from '@providers/mot-history-api/mot-interfaces';
import { of } from 'rxjs';
import { VehicleRegistrationComponent } from '../vehicle-registration';
import {
  mockBlankRegistrationNumber,
  mockInvalidRegistrationNumber,
  mockValidRegistrationNumber,
} from './vehicle-registration.mock';
import {ConnectionStatus} from '@providers/network-state/network-state';

describe('VehicleRegistrationComponent', () => {
  let fixture: ComponentFixture<VehicleRegistrationComponent>;
  let component: VehicleRegistrationComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleRegistrationComponent],
      providers: [Store],
      imports: [IonicModule, AppModule, ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(VehicleRegistrationComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);
  }));

  describe('ngOnChanges', () => {
    it(
      'should have vehicleRegistration form control be added to ' + 'form if there is no form control already there',
      () => {
        component.formControl = null;
        component.ngOnChanges();

        expect(component.formGroup.controls.vehicleRegistration).toBeTruthy();
      }
    );
  });

  describe('getMOT', () => {
    it('should remove evidenceDescriptionCtrl and alternateEvidenceCtrl from the form', () => {
      component.formGroup.addControl('alternateEvidenceCtrl', component.formControl);
      component.formGroup.addControl('evidenceDescriptionCtrl', component.formControl);
      spyOn(component.motApiService, 'getMotHistoryByIdentifier').and.returnValue(
        of({
          status: '200',
          data: {
            registration: 'reg',
            make: 'make',
            model: 'model',
            status: MotStatusCodes.VALID,
            expiryDate: '1/1/1',
          },
        })
      );
      component.getMOT('11');

      expect(component.formGroup.controls).not.toContain(['alternateEvidenceCtrl', 'evidenceDescriptionCtrl']);
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
  describe('shouldDisableMOTButton', () => {
    it('should return true if the search spinner is shown', () => {
      component.showSearchSpinner = true;
      component.formControl.setValue('valid');
      spyOn(component['networkState'], 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);

      expect(component.shouldDisableMOTButton()).toBeTrue();
    });

    it('should return true if the form control is not valid', () => {
      component.showSearchSpinner = false;
      component.formControl.setValue(null);
      spyOn(component['networkState'], 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);

      expect(component.shouldDisableMOTButton()).toBeTrue();
    });

    it('should return true if the network state is offline and not in practice mode', () => {
      component.showSearchSpinner = false;
      component.formControl.setValue('valid');
      component.isPracticeMode = false;
      spyOn(component['networkState'], 'getNetworkState').and.returnValue(ConnectionStatus.OFFLINE);

      expect(component.shouldDisableMOTButton()).toBeTrue();
    });

    it('should return false if the search spinner is not shown, form control is valid, and network state is online', () => {
      component.showSearchSpinner = false;
      component.formControl.setValue('valid');
      spyOn(component['networkState'], 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);

      expect(component.shouldDisableMOTButton()).toBeFalse();
    });

    it('should return false if the search spinner is not shown, form control is valid, and in practice mode', () => {
      component.showSearchSpinner = false;
      component.formControl.setValue('valid');
      component.isPracticeMode = true;
      spyOn(component['networkState'], 'getNetworkState').and.returnValue(ConnectionStatus.OFFLINE);

      expect(component.shouldDisableMOTButton()).toBeFalse();
    });
  });
});

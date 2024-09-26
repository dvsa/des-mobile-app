import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AppModule } from '@app/app.module';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MotHistoryWithStatus } from '@providers/mot-history-api/mot-history-api.service';
import { MotStatusCodes } from '@providers/mot-history-api/mot-interfaces';
import { ConnectionStatus } from '@providers/network-state/network-state';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { of } from 'rxjs';
import { MOTAbortedMethod, VehicleRegistrationComponent } from '../vehicle-registration';

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
    it('should remove altEvidenceDetailsCtrl and alternateEvidenceCtrl from the form', () => {
      component.formGroup.addControl('alternateEvidenceCtrl', component.formControl);
      component.formGroup.addControl('altEvidenceDetailsCtrl', component.formControl);
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

      expect(component.formGroup.controls).not.toContain(['alternateEvidenceCtrl', 'altEvidenceDetailsCtrl']);
    });
  });

  describe('abortMOTCall', () => {
    it('should emit motCallAborted', () => {
      spyOn(component.motCallAborted, 'emit');
      component.abortMOTCall(MOTAbortedMethod.NAVIGATION);
      expect(component.motCallAborted.emit).toHaveBeenCalled();
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

  describe('registrationInput', () => {
    it('clears existing data and aborts ongoing MOT call if searching', () => {
      spyOn(component, 'clearData');
      spyOn(component, 'abortMOTCall');
      component.isSearchingForMOT = true;

      component.registrationInput({ target: { value: 'ABC123' } });

      expect(component.clearData).toHaveBeenCalled();
      expect(component.abortMOTCall).toHaveBeenCalled();
    });

    it('sets hasCalledMOT to false', () => {
      component.hasCalledMOT = true;
      component.registrationInput({ target: { value: 'ABC123' } });
      expect(component.hasCalledMOT).toBeFalse();
    });

    it('removes non-alphanumeric characters from input value', () => {
      const event = { target: { value: 'ABC@123!' } };
      component.registrationInput(event);
      expect(event.target.value).toBe('ABC123');
    });

    it('sets form control error if input value is empty after removing non-alphanumeric characters', () => {
      const event = { target: { value: '@!#$' } };
      spyOn(component.formControl, 'setErrors');
      component.registrationInput(event);
      expect(component.formControl.setErrors).toHaveBeenCalledWith({ invalidValue: '' });
    });

    it('updates vehicleRegistration to uppercase', () => {
      const event = { target: { value: 'abc123' } };
      component.registrationInput(event);
      expect(component.vehicleRegistration).toBe('ABC123');
    });
  });

  describe('shouldDisableMOTButton', () => {
    it('should return true if the search spinner is shown', () => {
      component.isSearchingForMOT = true;
      component.formControl.setValue('valid');
      spyOn(component['networkState'], 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);

      expect(component.shouldDisableMOTButton()).toBeTrue();
    });

    it('should return true if the form control is not valid', () => {
      component.isSearchingForMOT = false;
      component.formControl.setValue(null);
      spyOn(component['networkState'], 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);

      expect(component.shouldDisableMOTButton()).toBeTrue();
    });

    it('should return true if the network state is offline and not in practice mode', () => {
      component.isSearchingForMOT = false;
      component.formControl.setValue('valid');
      component.isPracticeMode = false;
      spyOn(component['networkState'], 'getNetworkState').and.returnValue(ConnectionStatus.OFFLINE);

      expect(component.shouldDisableMOTButton()).toBeTrue();
    });

    it('should return false if the search spinner is not shown, form control is valid, and network state is online', () => {
      component.isSearchingForMOT = false;
      component.formControl.setValue('valid');
      spyOn(component['networkState'], 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);

      expect(component.shouldDisableMOTButton()).toBeFalse();
    });

    it('should return false if the search spinner is not shown, form control is valid, and in practice mode', () => {
      component.isSearchingForMOT = false;
      component.formControl.setValue('valid');
      component.isPracticeMode = true;
      spyOn(component['networkState'], 'getNetworkState').and.returnValue(ConnectionStatus.OFFLINE);

      expect(component.shouldDisableMOTButton()).toBeFalse();
    });
  });
  describe('isSearchFailed', () => {
    it('should return true if status is UNDEFINED', () => {
      component.motData = { status: HttpStatusCodes.UNDEFINED.toString() } as MotHistoryWithStatus;
      expect(component.isSearchFailed()).toEqual(true);
    });

    it('should return true if status is INTERNAL_SERVER_ERROR', () => {
      component.motData = { status: HttpStatusCodes.INTERNAL_SERVER_ERROR.toString() } as MotHistoryWithStatus;
      expect(component.isSearchFailed()).toEqual(true);
    });

    it('should return true if status is BAD_GATEWAY', () => {
      component.motData = { status: HttpStatusCodes.BAD_GATEWAY.toString() } as MotHistoryWithStatus;
      expect(component.isSearchFailed()).toEqual(true);
    });

    it('should return true if status is SERVICE_UNAVAILABLE', () => {
      component.motData = { status: HttpStatusCodes.SERVICE_UNAVAILABLE.toString() } as MotHistoryWithStatus;
      expect(component.isSearchFailed()).toEqual(true);
    });

    it('should return true if status is GATEWAY_TIMEOUT', () => {
      component.motData = { status: HttpStatusCodes.GATEWAY_TIMEOUT.toString() } as MotHistoryWithStatus;
      expect(component.isSearchFailed()).toEqual(true);
    });

    it('should return false if status is a listed status code', () => {
      component.motData = { status: HttpStatusCodes.OK.toString() } as MotHistoryWithStatus;
      expect(component.isSearchFailed()).toEqual(false);
    });
  });
});

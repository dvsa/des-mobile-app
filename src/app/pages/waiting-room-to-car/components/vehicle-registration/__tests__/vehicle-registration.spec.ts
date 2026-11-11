import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { provideBasePageMocks } from '@mocks/test-providers';
import { provideMockStore } from '@ngrx/store/testing';
import { MotHistoryWithStatus } from '@providers/mot-history-api/mot-history-api.service';
import { NetworkConnectionStatus } from '@providers/network-state/network-state';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { of } from 'rxjs';
import { MOTAbortedMethod, VehicleRegistrationComponent } from '../vehicle-registration';

describe('VehicleRegistrationComponent', () => {
  let fixture: ComponentFixture<VehicleRegistrationComponent>;
  let component: VehicleRegistrationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideBasePageMocks(), provideMockStore()],
      imports: [ReactiveFormsModule, VehicleRegistrationComponent],
    });

    fixture = TestBed.createComponent(VehicleRegistrationComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);
  });

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
      vi.spyOn(component.motApiService, 'getMotHistoryByIdentifier').mockReturnValue(
        of({
          status: '200',
          data: {
            registration: 'reg',
            make: 'make',
            model: 'model',
            status: 'Valid',
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
      vi.spyOn(component.motCallAborted, 'emit').mockReturnValue(undefined);
      component.abortMOTCall(MOTAbortedMethod.NAVIGATION);
      expect(component.motCallAborted.emit).toHaveBeenCalled();
    });
  });

  describe('updateMotList', () => {
    it('should emit vrnSearchListUpdate with passed param', () => {
      vi.spyOn(component.vrnSearchListUpdate, 'emit').mockReturnValue(undefined);
      component.updateMotList('ABC123');
      expect(component.vrnSearchListUpdate.emit).toHaveBeenCalledWith('ABC123');
    });
    it('should set hasCalledMOT to true', () => {
      component.hasCalledMOT = false;
      component.updateMotList('ABC123');
      expect(component.hasCalledMOT).toBe(true);
    });
    it('should call updateIsSearchingForMOT with false', () => {
      vi.spyOn(component, 'updateIsSearchingForMOT').mockReturnValue(undefined);
      component.hasCalledMOT = false;
      component.updateMotList('ABC123');
      expect(component.updateIsSearchingForMOT).toHaveBeenCalledWith(false);
    });
  });

  describe('updateIsSearchingForMOT', () => {
    it('should set isSearchingForMOT to true and emit the new value', () => {
      vi.spyOn(component.motSearchingStatusChange, 'emit').mockReturnValue(undefined);
      component.updateIsSearchingForMOT(true);
      expect(component.isSearchingForMOT).toBe(true);
      expect(component.motSearchingStatusChange.emit).toHaveBeenCalledWith(true);
    });

    it('should set isSearchingForMOT to false and emit the new value', () => {
      vi.spyOn(component.motSearchingStatusChange, 'emit').mockReturnValue(undefined);
      component.updateIsSearchingForMOT(false);
      expect(component.isSearchingForMOT).toBe(false);
      expect(component.motSearchingStatusChange.emit).toHaveBeenCalledWith(false);
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
      vi.spyOn(component, 'clearData').mockReturnValue(undefined);
      vi.spyOn(component, 'abortMOTCall').mockReturnValue(undefined);
      component.isSearchingForMOT = true;

      component.registrationInput({ value: 'ABC123' } as HTMLInputElement);

      expect(component.clearData).toHaveBeenCalled();
      expect(component.abortMOTCall).toHaveBeenCalled();
    });

    it('sets hasCalledMOT to false', () => {
      component.hasCalledMOT = true;
      component.registrationInput({ value: 'ABC123' } as HTMLInputElement);
      expect(component.hasCalledMOT).toBe(false);
    });

    it('removes non-alphanumeric characters from input value', () => {
      const event = { value: 'ABC@123!' } as HTMLInputElement;
      component.registrationInput(event);
      expect(event.value).toBe('ABC123');
    });

    it('sets form control error if input value is empty after removing non-alphanumeric characters', () => {
      const event: HTMLInputElement = { value: '@!#$' } as HTMLInputElement;
      vi.spyOn(component.formControl, 'setErrors').mockReturnValue(undefined);
      component.registrationInput(event);
      expect(component.formControl.setErrors).toHaveBeenCalledWith({ invalidValue: '' });
    });

    it('updates vehicleRegistration to uppercase', () => {
      const event: HTMLInputElement = { value: 'abc123' } as HTMLInputElement;
      component.registrationInput(event);
      expect(component.vehicleRegistration).toBe('ABC123');
    });
  });

  describe('shouldDisableMOTButton', () => {
    it('should return true if the search spinner is shown', () => {
      component.isSearchingForMOT = true;
      component.formControl.setValue('valid');
      vi.spyOn(component.networkState, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.ONLINE);

      expect(component.shouldDisableMOTButton()).toBe(true);
    });

    it('should return true if the form control is not valid', () => {
      component.isSearchingForMOT = false;
      component.formControl.setValue(null);
      vi.spyOn(component.networkState, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.ONLINE);

      expect(component.shouldDisableMOTButton()).toBe(true);
    });

    it('should return true if the network state is offline and not in practice mode', () => {
      component.isSearchingForMOT = false;
      component.formControl.setValue('valid');
      component.isPracticeMode = false;
      vi.spyOn(component.networkState, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.OFFLINE);

      expect(component.shouldDisableMOTButton()).toBe(true);
    });

    it('should return false if the search spinner is not shown, form control is valid, and network state is online', () => {
      component.isSearchingForMOT = false;
      component.formControl.setValue('valid');
      vi.spyOn(component.networkState, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.ONLINE);

      expect(component.shouldDisableMOTButton()).toBe(false);
    });

    it('should return false if the search spinner is not shown, form control is valid, and in practice mode', () => {
      component.isSearchingForMOT = false;
      component.formControl.setValue('valid');
      component.isPracticeMode = true;
      vi.spyOn(component.networkState, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.OFFLINE);

      expect(component.shouldDisableMOTButton()).toBe(false);
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

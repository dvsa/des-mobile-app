import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WeatherConditionsComponent } from '@pages/office/components/weather-conditions/weather-conditions';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { CircuitType } from '@shared/models/circuit-type';

describe('WeatherConditionsComponent', () => {
  let fixture: ComponentFixture<WeatherConditionsComponent>;
  let component: WeatherConditionsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, WeatherConditionsComponent],
      providers: [{ provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider }],
    });

    fixture = TestBed.createComponent(WeatherConditionsComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges', () => {
    it('should clear validators from FormControl if visibilityType is VisibilityType.NotVisible', () => {
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(WeatherConditionsComponent.fieldName, component.formControl);
      component.formGroup.get(WeatherConditionsComponent.fieldName).setValidators([Validators.required]);

      vi.spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').mockReturnValue(VisibilityType.NotVisible);
      component.ngOnChanges();

      expect(component.formGroup.get(WeatherConditionsComponent.fieldName).hasValidator(Validators.required)).toBe(
        false
      );
    });
    it('should set validators to FormControl if visibilityType is not VisibilityType.NotVisible', () => {
      component.formGroup = new UntypedFormGroup({});

      vi.spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').mockReturnValue(VisibilityType.Visible);
      component.ngOnChanges();

      expect(component.formGroup.get(WeatherConditionsComponent.fieldName).hasValidator(Validators.required)).toBe(
        true
      );
    });
  });

  describe('weatherConditionsChanged', () => {
    it('should emit weatherConditions', () => {
      component.formControl = new UntypedFormControl([]);
      vi.spyOn(component.weatherConditionsChange, 'emit').mockReturnValue(undefined);

      component.weatherConditionsChanged(['Showers']);
      expect(component.weatherConditionsChange.emit).toHaveBeenCalledWith(['Showers']);
    });
    it('should mark the field as pristine if the passed array is empty', () => {
      component.formControl = new UntypedFormControl([]);
      vi.spyOn(component.formControl, 'markAsPristine').mockReturnValue(undefined);

      component.weatherConditionsChanged([]);
      expect(component.formControl.markAsPristine).toHaveBeenCalled();
    });
    it('should not mark the field as pristine if the passed array is empty', () => {
      component.formControl = new UntypedFormControl([]);
      vi.spyOn(component.formControl, 'markAsPristine').mockReturnValue(undefined);

      component.weatherConditionsChanged(['Icy']);
      expect(component.formControl.markAsPristine).not.toHaveBeenCalled();
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(WeatherConditionsComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(WeatherConditionsComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(WeatherConditionsComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(WeatherConditionsComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });
});

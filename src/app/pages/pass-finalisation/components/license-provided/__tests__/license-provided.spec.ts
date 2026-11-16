import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LicenseProvidedComponent } from '../license-provided';

describe('LicenseProvidedComponent', () => {
  let fixture: ComponentFixture<LicenseProvidedComponent>;
  let component: LicenseProvidedComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LicenseProvidedComponent],
    });

    fixture = TestBed.createComponent(LicenseProvidedComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({});
  });

  describe('Class', () => {
    describe('ProvisionalLicenseReceived', () => {
      it('should emit license received if license received is selected', () => {
        vi.spyOn(component.licenseReceived, 'emit').mockReturnValue(undefined);
        component.provisionalLicenseReceived();
        expect(component.licenseReceived.emit).toHaveBeenCalled();
      });
    });

    describe('ProvisionalLicneseNotReceived', () => {
      it('should emit license not received if license not received is selected', () => {
        vi.spyOn(component.licenseNotReceived, 'emit').mockReturnValue(undefined);
        component.provisionalLicenseNotReceived();
        expect(component.licenseNotReceived.emit).toHaveBeenCalled();
      });
    });

    describe('isInvalid', () => {
      it('should validate the field when it is valid', () => {
        component.license = true;
        component.ngOnChanges();
        fixture.detectChanges();
        const result: boolean = component.isInvalid();
        expect(result).toEqual(false);
      });

      it('should not validate the field when it is dirty', () => {
        component.license = null;
        component.ngOnChanges();
        component.formControl.markAsDirty();
        fixture.detectChanges();
        const result: boolean = component.isInvalid();
        expect(result).toEqual(true);
      });
    });
  });
});

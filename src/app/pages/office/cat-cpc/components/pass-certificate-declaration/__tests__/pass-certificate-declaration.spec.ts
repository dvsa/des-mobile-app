import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PassCertificateDeclarationComponent } from '../pass-certificate-declaration';

describe('PassCertificateDeclarationComponent', () => {
  let fixture: ComponentFixture<PassCertificateDeclarationComponent>;
  let component: PassCertificateDeclarationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PassCertificateDeclarationComponent],
    });

    fixture = TestBed.createComponent(PassCertificateDeclarationComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  });

  describe('Class', () => {
    describe('passCertificateDeclarationChanged', () => {
      it('should emit selected value - true', () => {
        vi.spyOn(component.passCertificateDeclarationChange, 'emit').mockReturnValue(undefined);
        component.passCertificateDeclarationChanged(true);
        expect(component.passCertificateDeclarationChange.emit).toHaveBeenCalledWith(true);
      });
      it('should emit selected value - false', () => {
        vi.spyOn(component.passCertificateDeclarationChange, 'emit').mockReturnValue(undefined);
        component.passCertificateDeclarationChanged(false);
        expect(component.passCertificateDeclarationChange.emit).toHaveBeenCalledWith(false);
      });
    });

    describe('invalid', () => {
      it('should validate the field when it is valid', () => {
        component.ngOnChanges();
        component.formGroup.get(PassCertificateDeclarationComponent.fieldName).setValue(true);
        fixture.detectChanges();
        const result: boolean = component.invalid;
        expect(result).toEqual(false);
      });
      it('should not validate the field when it is dirty', () => {
        component.ngOnChanges();
        component.formControl.markAsDirty();
        fixture.detectChanges();
        const result: boolean = component.invalid;
        expect(result).toEqual(true);
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HealthDeclarationSignedComponent } from '../health-declaration-signed';

describe('HealthDeclarationSignedComponent', () => {
  let fixture: ComponentFixture<HealthDeclarationSignedComponent>;
  let component: HealthDeclarationSignedComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HealthDeclarationSignedComponent],
    });

    fixture = TestBed.createComponent(HealthDeclarationSignedComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  });

  describe('Class', () => {
    describe('healthDeclarationChanged', () => {
      it('should emit selected value - true', () => {
        vi.spyOn(component.healthDeclarationChange, 'emit').mockReturnValue(undefined);
        component.healthDeclarationChanged('Signed');
        expect(component.healthDeclarationChange.emit).toHaveBeenCalledWith(true);
      });

      it('should emit selected value - false', () => {
        vi.spyOn(component.healthDeclarationChange, 'emit').mockReturnValue(undefined);
        component.healthDeclarationChanged('NotSigned');
        expect(component.healthDeclarationChange.emit).toHaveBeenCalledWith(false);
      });
    });

    describe('invalid', () => {
      it('should validate the field when it is valid', () => {
        component.ngOnChanges();
        component.formGroup.get(HealthDeclarationSignedComponent.fieldName).setValue(true);
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

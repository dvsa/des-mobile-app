import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IonCol, IonRow } from '@ionic/angular';
import { provideTestTranslations } from '@mocks/test-providers';
import { ResidencyDeclarationComponent } from '../residency-declaration';

describe('ResidencyDeclarationComponent', () => {
  let fixture: ComponentFixture<ResidencyDeclarationComponent>;
  let component: ResidencyDeclarationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, IonRow, IonCol, ResidencyDeclarationComponent],
      providers: [provideTestTranslations()],
    });

    fixture = TestBed.createComponent(ResidencyDeclarationComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    describe('ngOnChanges', () => {
      it('should correctly setup the form control', () => {
        // ARRANGE
        component.formGroup = new UntypedFormGroup({});
        component.selected = true;
        // ACT
        component.ngOnChanges();
        // ASSERT
        const field = component.formGroup.get(ResidencyDeclarationComponent.fieldName);
        expect(field).not.toBeNull();
        expect(field.validator).not.toBeNull();
        expect(field.value).toEqual(true);
      });
    });
    describe('residencyDeclarationChanged', () => {
      it('should emit a residencyDeclarationChange event', () => {
        // ARRANGE
        component.formGroup = new UntypedFormGroup({});
        component.ngOnChanges();
        component.residencyDeclarationChange = new EventEmitter();
        vi.spyOn(component.residencyDeclarationChange, 'emit').mockReturnValue(undefined);

        // ACT
        component.residencyDeclarationChanged(true);
        fixture.detectChanges();

        // ASSERT
        expect(component.residencyDeclarationChange.emit).toHaveBeenCalled();
      });
    });
    describe('isInvalid', () => {
      it('should validate the field when it is valid', () => {
        // ARRANGE
        component.formGroup = new UntypedFormGroup({});
        component.selected = true;
        component.ngOnChanges();
        fixture.detectChanges();
        // ACT
        const result: boolean = component.isInvalid();

        // ASSERT
        expect(result).toEqual(false);
      });
      it('should not validate the field when it is dirty', () => {
        // ARRANGE
        component.formGroup = new UntypedFormGroup({});
        component.ngOnChanges();
        component.formControl.markAsDirty();
        fixture.detectChanges();

        // ACT
        const result: boolean = component.isInvalid();

        // ASSERT
        expect(result).toEqual(true);
      });
    });
  });
});

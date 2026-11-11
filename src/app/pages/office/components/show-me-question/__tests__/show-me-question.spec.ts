import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { provideMockStore } from '@ngrx/store/testing';
import { ShowMeQuestionComponent } from '@pages/office/components/show-me-question/show-me-question';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';

describe('ShowMeQuestionComponent', () => {
  let fixture: ComponentFixture<ShowMeQuestionComponent>;
  let component: ShowMeQuestionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ShowMeQuestionComponent],
      providers: [
        provideMockStore({ ...{} }),
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(ShowMeQuestionComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges', () => {
    it('should clear validators from FormControl if visibilityType is VisibilityType.NotVisible', () => {
      component.formControl = new UntypedFormControl();
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(ShowMeQuestionComponent.fieldName, component.formControl);
      component.formGroup.get(ShowMeQuestionComponent.fieldName).setValidators([Validators.required]);

      vi.spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').mockReturnValue(VisibilityType.NotVisible);
      component.ngOnChanges();

      expect(component.formGroup.get(ShowMeQuestionComponent.fieldName).hasValidator(Validators.required)).toBe(false);
    });
    it('should set validators to FormControl if visibilityType is not VisibilityType.NotVisible', () => {
      component.formGroup = new UntypedFormGroup({});

      vi.spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').mockReturnValue(VisibilityType.Visible);
      component.ngOnChanges();

      expect(component.formGroup.get(ShowMeQuestionComponent.fieldName).hasValidator(Validators.required)).toBe(true);
    });
  });

  describe('showMeQuestionChanged', () => {
    it('should emit showMeQuestion while from control is valid', () => {
      vi.spyOn(component.showMeQuestionChange, 'emit').mockReturnValue(undefined);
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(1);

      component.showMeQuestionChanged({
        code: 'test',
        description: 'test',
        shortName: 'test',
      });
      expect(component.showMeQuestionChange.emit).toHaveBeenCalledWith({
        code: 'test',
        description: 'test',
        shortName: 'test',
      });
    });
    it('should not emit showMeQuestion while from control is not valid', () => {
      vi.spyOn(component.showMeQuestionChange, 'emit').mockReturnValue(undefined);
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(null);

      component.showMeQuestionChanged({
        code: 'test',
        description: 'test',
        shortName: 'test',
      });
      expect(component.showMeQuestionChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';

describe('AccompanimentComponent', () => {
  let fixture: ComponentFixture<AccompanimentComponent>;
  let component: AccompanimentComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AccompanimentComponent],
    });

    fixture = TestBed.createComponent(AccompanimentComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);
  });

  describe('ngOnChanges', () => {
    it('should have accompaniment form control be added to ' + 'form if there is no form control already there', () => {
      component.formControl = null;
      component.ngOnChanges();

      expect(component.formGroup.controls[`accompaniment-${component.accompanimentType}`]).toBeTruthy();
    });
  });

  describe('accompanimentChanged', () => {
    it('should emit when formControl is valid', () => {
      component.formControl = new UntypedFormControl(1);
      vi.spyOn(component.accompanimentChange, 'emit').mockReturnValue(undefined);
      component.accompanimentChanged();
      expect(component.accompanimentChange.emit).toHaveBeenCalled();
    });
    it('should not emit when formControl is invalid', () => {
      component.formControl.setValue(null);
      vi.spyOn(component.accompanimentChange, 'emit').mockReturnValue(undefined);
      component.accompanimentChanged();
      expect(component.accompanimentChange.emit).not.toHaveBeenCalled();
    });
  });
});

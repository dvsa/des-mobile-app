import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonRow, IonicModule } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { AlternateMotEvidenceComponent } from '../alternate-mot-evidence.component';

enum AlternateEvidenceTestResult {
  Pass = 'P',
  Fail = 'F',
}

describe('AlternateMotEvidenceComponent', () => {
  let component: AlternateMotEvidenceComponent;
  let fixture: ComponentFixture<AlternateMotEvidenceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlternateMotEvidenceComponent, MockComponent(IonRow)],
      imports: [IonicModule.forRoot(), CommonModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternateMotEvidenceComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    fixture.detectChanges();
  });

  describe('setupControl', () => {
    it('should create and set up the form control when it does not exist', () => {
      component.alternateEvidencePassRadioChecked = true;
      component.alternateEvidenceFailRadioChecked = false;

      component.setupControl();

      expect(component.formControl).toBeDefined();
      expect(component.formControl instanceof UntypedFormControl).toBe(true);

      // Check if the validator function is defined
      expect(component.formControl.validator).toBeDefined();
    });

    it('should add the form control to the form group when it does not exist', () => {
      spyOn(component.formGroup, 'contains').and.returnValue(false);

      component.setupControl();

      expect(component.formControl).toBeDefined();
      expect(component.formControl instanceof UntypedFormControl).toBe(true);
      expect(component.formGroup.controls['alternateEvidenceCtrl']).toBe(component.formControl);
    });

    it('should set the form control value based on alternate evidence test result', () => {
      component.alternateEvidencePassRadioChecked = true;
      component.alternateEvidenceFailRadioChecked = false;
      spyOn(component.formControl, 'patchValue');

      component.setupControl();

      expect(component.formControl.patchValue).toHaveBeenCalledWith(AlternateEvidenceTestResult.Pass);
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.setupControl();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.setupControl();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.setupControl();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.setupControl();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });
  describe('alternateEvidenceTestResultChanged', () => {
    it('should emit alternateEvidenceChange with true if the passed parameter is equal to P', () => {
      spyOn(component.alternateEvidenceChange, 'emit');
      component.formControl = new UntypedFormControl();

      component.alternateEvidenceTestResultChanged('P');

      expect(component.alternateEvidenceChange.emit).toHaveBeenCalledWith(true);
    });
  });
  describe('alternateEvidenceTestResultChanged', () => {
    it('should emit alternateEvidenceChange with true if the passed parameter ' + 'is not equal to P', () => {
      spyOn(component.alternateEvidenceChange, 'emit');
      component.formControl = new UntypedFormControl();

      component.alternateEvidenceTestResultChanged('string');

      expect(component.alternateEvidenceChange.emit).toHaveBeenCalledWith(false);
    });
  });
});

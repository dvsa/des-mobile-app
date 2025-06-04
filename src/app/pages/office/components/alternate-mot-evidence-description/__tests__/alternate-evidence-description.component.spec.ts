import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlternateEvidenceDescriptionComponent } from '../alternate-evidence-description.component';

describe('AlternateEvidenceDescriptionComponent', () => {
  let component: AlternateEvidenceDescriptionComponent;
  let fixture: ComponentFixture<AlternateEvidenceDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [AlternateEvidenceDescriptionComponent],
      imports: [IonicModule, CommonModule],
    });

    fixture = TestBed.createComponent(AlternateEvidenceDescriptionComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl();
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    it('should create formControl if it does not exist', () => {
      component.formControl = null;
      component.ngOnChanges();
      expect(component.formControl).toBeDefined();
      expect(component.formControl instanceof UntypedFormControl).toBe(true);
    });

    it('should patch formControl value with alternateEvidenceDescription', () => {
      component.formControl = null;
      component.alternateEvidenceDescription = 'Test Description';
      component.ngOnChanges();
      expect(component.formControl.value).toBe('Test Description');
    });

    it('should add formControl to formGroup if altEvidenceDetailsCtrl does not exist', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      console.log(component.formGroup.contains('altEvidenceDetailsCtrl'));
      expect(component.formGroup.contains('altEvidenceDetailsCtrl')).toBeTrue();
    });

    it('should set formControl in formGroup if altEvidenceDetailsCtrl exists', () => {
      component.formControl = null;
      spyOn(component.formGroup, 'contains').and.returnValue(true);
      component.ngOnChanges();
      expect(component.formGroup.controls.altEvidenceDetailsCtrl).toBe(component.formControl);
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

  describe('charactersExceeded', () => {
    it('should return true if the character count has been exceeded', () => {
      spyOn(component.characterCountService, 'charactersExceeded').and.returnValue(true);
      component.charsRemaining = -1;
      expect(component.charactersExceeded()).toBeTrue();
    });

    it('should return false if the character count has not been exceeded', () => {
      spyOn(component.characterCountService, 'charactersExceeded').and.returnValue(false);
      component.charsRemaining = 10;
      expect(component.charactersExceeded()).toBeFalse();
    });
  });

  describe('characterCountChanged', () => {
    it('should update charsRemaining and validate the form control', () => {
      component.formGroup = new UntypedFormGroup({});
      component.formControl = new UntypedFormControl();
      component.formGroup.addControl('altEvidenceDetailsCtrl', component.formControl);
      spyOn(component.formGroup.get('altEvidenceDetailsCtrl'), 'updateValueAndValidity');
      component.characterCountChanged(5);
      expect(component.charsRemaining).toBe(5);
      expect(component.formGroup.get('altEvidenceDetailsCtrl').updateValueAndValidity).toHaveBeenCalled();
    });
  });

  describe('getCharacterCountText', () => {
    it('should return the correct character count text from the service', () => {
      spyOn(component.characterCountService, 'getCharacterCountText').and.returnValue('5 characters remaining');
      component.charsRemaining = 5;
      expect(component.getCharacterCountText()).toBe('5 characters remaining');
    });
  });

  describe('evidenceDescriptionTestResultChanged', () => {
    it('should emit evidenceDescriptionTestResultChange with the value passed', () => {
      spyOn(component.evidenceDescriptionTestResultChange, 'emit');
      component.evidenceDescriptionTestResultChanged('string');
      expect(component.evidenceDescriptionTestResultChange.emit).toHaveBeenCalledWith('string');
    });
  });
});

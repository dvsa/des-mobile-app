import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlternateEvidenceDescriptionComponent } from '../alternate-evidence-description.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

describe('AlternateEvidenceDescriptionComponent', () => {
  let component: AlternateEvidenceDescriptionComponent;
  let fixture: ComponentFixture<AlternateEvidenceDescriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlternateEvidenceDescriptionComponent],
      imports: [IonicModule, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AlternateEvidenceDescriptionComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl();
    fixture.detectChanges();
  }));

  describe('ngOnChanges', () => {
    it('should create and set up the form control when it does not exist', () => {
      component.formControl = null;
      component.ngOnChanges();

      expect(component.formControl).toBeDefined();
      expect(component.formControl instanceof UntypedFormControl).toBe(true);

      // Check if the validator function is defined
      expect(component.formControl.validator).toBeDefined();
    });
    it('should add the form control to the form group when it does not exist', () => {
      spyOn(component.formGroup, 'contains').and.returnValue(false);
      component.formControl = null;

      component.ngOnChanges();

      expect(component.formControl).toBeDefined();
      expect(component.formControl instanceof UntypedFormControl).toBe(true);
      expect(component.formGroup.controls['evidenceDescriptionCtrl']).toBe(component.formControl);
    });
    it('should patch evidenceDescriptionCtrl into the formControl when it does exist', () => {
      spyOn(component.formGroup, 'contains').and.returnValue(true);
      component.formControl = null;
      component.formGroup.addControl('evidenceDescriptionCtrl', new UntypedFormControl('string'));

      component.ngOnChanges();

      expect(component.formControl).toBeDefined();
      expect(component.formControl instanceof UntypedFormControl).toBe(true);
      expect(component.formGroup.controls['evidenceDescriptionCtrl']).toBe(component.formControl);
      expect(component.formControl.value).toEqual('string');
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

  describe('evidenceDescriptionTestResultChanged', () => {
    it('should emit evidenceDescriptionTestResultChange with the value passed', () => {
      spyOn(component.evidenceDescriptionTestResultChange, 'emit');
      component.evidenceDescriptionTestResultChanged('string');
      expect(component.evidenceDescriptionTestResultChange.emit).toHaveBeenCalledWith('string');
    });
  });
});

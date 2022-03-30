import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import {
  PASS_CERTIFICATE_LENGTH_A_MOD1,
} from '@providers/pass-certificate-validation/pass-certificate-validation.constants';
import { PassCertificateNumberCatAMod1Component } from '../pass-certificate-number.cat-a-mod1';

describe('PassCertificateNumberCatAMod1Component', () => {
  let fixture: ComponentFixture<PassCertificateNumberCatAMod1Component>;
  let component: PassCertificateNumberCatAMod1Component;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PassCertificateNumberCatAMod1Component,
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PassCertificateNumberCatAMod1Component);
    component = fixture.componentInstance;
    component.form = new FormGroup({});
    component.formControl = new FormControl(null, [
      Validators.maxLength(PASS_CERTIFICATE_LENGTH_A_MOD1),
      Validators.minLength(PASS_CERTIFICATE_LENGTH_A_MOD1),
      Validators.pattern(component.passCertificateAMOD1Validator.pattern),
      Validators.required,
    ]);
  }));

  describe('Class', () => {
    describe('passCertificateNumberChanged', () => {
      it('should emit pass certificate number if 7 characters and valid', () => {
        spyOn(component.formControl, 'setErrors');
        spyOn(component.passCertificateNumberChange, 'emit');
        const passCertificateNumber = 'C26754E';
        component.passCertificateNumberChanged(passCertificateNumber);
        expect(component.formControl.setErrors).not.toHaveBeenCalled();
        expect(component.passCertificateNumberChange.emit).toHaveBeenCalledWith(passCertificateNumber);
      });

      it('should recognise a permitted length but invalid format then set errors', () => {
        spyOn(component.formControl, 'setErrors');
        spyOn(component.passCertificateNumberChange, 'emit');
        const passCertificateNumber = 'ABCDEFG';
        component.passCertificateNumberChanged(passCertificateNumber);
        expect(component.formControl.setErrors).toHaveBeenCalledWith({
          invalidFormat: passCertificateNumber,
        });
        expect(component.passCertificateNumberChange.emit).toHaveBeenCalledWith(passCertificateNumber);
      });

      it('should recognise an illegal length then set errors', () => {
        spyOn(component.formControl, 'setErrors');
        spyOn(component.passCertificateNumberChange, 'emit');
        const passCertificateNumber = 'A1234567789';
        component.passCertificateNumberChanged(passCertificateNumber);
        expect(component.formControl.setErrors).toHaveBeenCalledWith({
          actualLength: 11,
          permittedLength: 8,
          value: 'A1234567789',
        });
        expect(component.passCertificateNumberChange.emit).toHaveBeenCalledWith(passCertificateNumber);
      });

      it('should recognise a correct string length & invalid byte length then set errors', () => {
        spyOn(component.formControl, 'setErrors');
        spyOn(component.passCertificateNumberChange, 'emit');
        const passCertificateNumber = 'B8711 2–';
        component.passCertificateNumberChanged(passCertificateNumber);
        expect(component.formControl.setErrors).toHaveBeenCalledWith({
          actualLength: 10,
          permittedLength: 8,
          value: passCertificateNumber,
        });
        expect(component.passCertificateNumberChange.emit).toHaveBeenCalledWith(passCertificateNumber);
      });
    });

    describe('isInvalid', () => {
      it('should return false when the field is valid and not dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('C26754E');
        // ACT
        const result: boolean = component.invalid;
        // ASSET
        expect(component.formControl.dirty).toEqual(false);
        expect(!component.formControl.valid).toEqual(false);
        expect(result).toEqual(false);
      });

      it('should return false when the field is not valid and is not dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('1');
        // ACT
        const result: boolean = component.invalid;
        // ASSET
        expect(component.formControl.dirty).toEqual(false);
        expect(!component.formControl.valid).toEqual(true);
        expect(result).toEqual(false);
      });

      it('should return true if the field is empty and is marked as dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.invalid;
        // ASSERT
        expect(component.formControl.dirty).toEqual(true);
        expect(!component.formControl.valid).toEqual(true);
        expect(result).toEqual(true);
      });

      it('should return true if the field has less then 7 characters and is marked as dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('1');
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.invalid;
        // ASSERT
        expect(component.formControl.dirty).toEqual(true);
        expect(!component.formControl.valid).toEqual(true);
        expect(result).toEqual(true);
      });

      it('should return true if the field has more then 7 characters and is marked as dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('12345678910');
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.invalid;
        // ASSERT
        expect(component.formControl.dirty).toEqual(true);
        expect(!component.formControl.valid).toEqual(true);
        expect(result).toEqual(true);
      });
    });
  });
});

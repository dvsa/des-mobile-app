import {
  PassCertificateValidationProvider,
} from '@providers/pass-certificate-validation/pass-certificate-validation';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { PassCertificateNumberComponent } from '../pass-certificate-number';

describe('passCertificateNumberComponent', () => {
  let fixture: ComponentFixture<PassCertificateNumberComponent>;
  let component: PassCertificateNumberComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PassCertificateNumberComponent,
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        PassCertificateValidationProvider,
        { provide: AppComponent, useClass: MockAppComponent },

      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PassCertificateNumberComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({});
  }));

  describe('Class', () => {
    describe('passCertificateNumberChanged', () => {
      it('should emit pass certificate number if 8 characters and valid', () => {
        spyOn(component.passCertificateNumberChange, 'emit');
        const passCertificateNumber = 'C267548E';
        component.passCertificateNumberChanged(passCertificateNumber);
        expect(component.passCertificateNumberChange.emit).toHaveBeenCalledWith(passCertificateNumber);
      });
    });

    describe('isInvalid', () => {
      it('should return false when the field is valid and not dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('C267548E');
        // ACT
        const result: boolean = component.isInvalid();
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
        const result: boolean = component.isInvalid();
        // ASSET
        expect(component.formControl.dirty).toEqual(false);
        expect(!component.formControl.valid).toEqual(true);
        expect(result).toEqual(false);
      });
      it('should return false when the field is valid and is dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('C267548E');
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.isInvalid();
        // ASSET
        expect(component.formControl.dirty).toEqual(true);
        expect(!component.formControl.valid).toEqual(false);
        expect(result).toEqual(false);
      });
      it('should return true if the field is empty and is marked as dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.isInvalid();
        // ASSERT
        expect(component.formControl.dirty).toEqual(true);
        expect(!component.formControl.valid).toEqual(true);
        expect(result).toEqual(true);
      });
      it('should return true if the field has less then 8 characters and is marked as dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('1');
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.isInvalid();
        // ASSERT
        expect(component.formControl.dirty).toEqual(true);
        expect(!component.formControl.valid).toEqual(true);
        expect(result).toEqual(true);
      });
      it('should return true if the field has more then 8 characters and is marked as dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('12345678910');
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.isInvalid();
        // ASSERT
        expect(component.formControl.dirty).toEqual(true);
        expect(!component.formControl.valid).toEqual(true);
        expect(result).toEqual(true);
      });
    });
  });
});

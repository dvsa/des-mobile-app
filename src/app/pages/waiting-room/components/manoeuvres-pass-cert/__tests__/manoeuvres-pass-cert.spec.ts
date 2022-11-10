import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { ManoeuvresPassCertificateComponent } from '../manoeuvres-pass-cert';

describe('ManoeuvresPassCertificateComponent', () => {
  let fixture: ComponentFixture<ManoeuvresPassCertificateComponent>;
  let component: ManoeuvresPassCertificateComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ManoeuvresPassCertificateComponent,
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        PassCertificateValidationProvider,
        { provide: AppComponent, useClass: MockAppComponent },
      ],
    });

    fixture = TestBed.createComponent(ManoeuvresPassCertificateComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('Class', () => {
    describe('manoeuvresPassCertificateNumberChanged', () => {
      it('should emit manoeuvre pass certificate number if 8 characters and valid', () => {
        spyOn(component.manoeuvresPassCertificateNumberChange, 'emit');
        const passCertificateNumber = 'C267548E';
        component.manoeuvresPassCertificateNumberChanged(passCertificateNumber);
        expect(component.manoeuvresPassCertificateNumberChange.emit).toHaveBeenCalledWith(passCertificateNumber);
      });
    });

    describe('get invalid', () => {
      it('should return false when the field is valid and not dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('C267548E');
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
      it('should return false when the field is valid and is dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('C267548E');
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.invalid;
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
        const result: boolean = component.invalid;
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
        const result: boolean = component.invalid;
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
        const result: boolean = component.invalid;
        // ASSERT
        expect(component.formControl.dirty).toEqual(true);
        expect(!component.formControl.valid).toEqual(true);
        expect(result).toEqual(true);
      });
    });
  });
});

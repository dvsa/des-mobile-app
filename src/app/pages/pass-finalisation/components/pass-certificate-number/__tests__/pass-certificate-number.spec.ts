import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
import { PassCertificateNumberComponent } from '../pass-certificate-number';

describe('PassCertificateNumberComponent', () => {
  let fixture: ComponentFixture<PassCertificateNumberComponent>;
  let component: PassCertificateNumberComponent;
  let passCertValidationProvider: PassCertificateValidationProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PassCertificateNumberComponent,
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        PassCertificateValidationProvider,
        {
          provide: AppComponent,
          useClass: MockAppComponent,
        },
        {
          provide: AccessibilityService,
          useClass: AccessibilityServiceMock,
        },
      ],
    });

    fixture = TestBed.createComponent(PassCertificateNumberComponent);
    component = fixture.componentInstance;
    passCertValidationProvider = TestBed.inject(PassCertificateValidationProvider);
    component.form = new UntypedFormGroup({});
  }));

  describe('Class', () => {
    describe('passCertificateNumberChanged', () => {
      it('should emit pass certificate number if 8 characters and valid', () => {
        spyOn(component.passCertificateNumberChange, 'emit');
        const passCertificateNumber = 'C267548E';
        component.passCertificateNumberChanged(passCertificateNumber);
        expect(component.passCertificateNumberChange.emit)
          .toHaveBeenCalledWith(passCertificateNumber);
      });
    });
    describe('validatePassCertificate', () => {
      it('should return { valid: false }  when isPassCertificateValid returns false', () => {
        spyOn(passCertValidationProvider, 'isPassCertificateValid')
          .and
          .returnValue(false);
        expect(component.validatePassCertificate(new UntypedFormControl('')))
          .toEqual({ valid: false });
      });
      it('should return { valid: true, duplicate: true  } when already used before', () => {
        spyOn(passCertValidationProvider, 'isPassCertificateValid')
          .and
          .returnValue(true);
        component.pastPassCerts = ['A123456X'];
        expect(component.validatePassCertificate(new UntypedFormControl('A123456X')))
          .toEqual({
            valid: true,
            duplicate: true,
          });
      });
      it('should return null when already used valid and un-used', () => {
        spyOn(passCertValidationProvider, 'isPassCertificateValid')
          .and
          .returnValue(true);
        component.pastPassCerts = ['A123456X'];
        expect(component.validatePassCertificate(new UntypedFormControl('C123456X')))
          .toEqual(null);
      });
    });
    describe('isInvalid', () => {
      it('should return false when the field is valid and not dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('C267548E');
        // ACT
        const result: boolean = component.invalid;
        // ASSET
        expect(component.formControl.dirty)
          .toEqual(false);
        expect(!component.formControl.valid)
          .toEqual(false);
        expect(result)
          .toEqual(false);
      });
      it('should return false when the field is not valid and is not dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('1');
        // ACT
        const result: boolean = component.invalid;
        // ASSET
        expect(component.formControl.dirty)
          .toEqual(false);
        expect(!component.formControl.valid)
          .toEqual(true);
        expect(result)
          .toEqual(false);
      });
      it('should return false when the field is valid and is dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('C267548E');
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.invalid;
        // ASSET
        expect(component.formControl.dirty)
          .toEqual(true);
        expect(!component.formControl.valid)
          .toEqual(false);
        expect(result)
          .toEqual(false);
      });
      it('should return true if the field is empty and is marked as dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.invalid;
        // ASSERT
        expect(component.formControl.dirty)
          .toEqual(true);
        expect(!component.formControl.valid)
          .toEqual(true);
        expect(result)
          .toEqual(true);
      });
      it('should return true if the field has less then 8 characters and is marked as dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('1');
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.invalid;
        // ASSERT
        expect(component.formControl.dirty)
          .toEqual(true);
        expect(!component.formControl.valid)
          .toEqual(true);
        expect(result)
          .toEqual(true);
      });
      it('should return true if the field has more then 8 characters and is marked as dirty', () => {
        // SETUP
        component.ngOnChanges();
        component.formControl.setValue('12345678910');
        component.formControl.markAsDirty();
        // ACT
        const result: boolean = component.invalid;
        // ASSERT
        expect(component.formControl.dirty)
          .toEqual(true);
        expect(!component.formControl.valid)
          .toEqual(true);
        expect(result)
          .toEqual(true);
      });
    });
  });
});

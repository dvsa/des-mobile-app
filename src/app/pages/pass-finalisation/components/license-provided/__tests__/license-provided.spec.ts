import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LicenseProvidedComponent } from '../license-provided';

describe('LicenseProvidedComponent', () => {
  let fixture: ComponentFixture<LicenseProvidedComponent>;
  let component: LicenseProvidedComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        LicenseProvidedComponent,
      ],
      imports: [
        IonicModule,
        ReactiveFormsModule,
      ],
    });

    fixture = TestBed.createComponent(LicenseProvidedComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({});
  }));

  describe('Class', () => {
    describe('ProvisionalLicenseReceived', () => {
      it('should emit license received if license received is selected', () => {
        spyOn(component.licenseReceived, 'emit');
        component.provisionalLicenseReceived();
        expect(component.licenseReceived.emit).toHaveBeenCalled();
      });
    });

    describe('ProvisionalLicneseNotReceived', () => {
      it('should emit license not received if license not received is selected', () => {
        spyOn(component.licenseNotReceived, 'emit');
        component.provisionalLicenseNotReceived();
        expect(component.licenseNotReceived.emit).toHaveBeenCalled();
      });
    });

    describe('isInvalid', () => {
      it('should validate the field when it is valid', () => {
        component.license = true;
        component.ngOnChanges();
        fixture.detectChanges();
        const result: boolean = component.isInvalid();
        expect(result).toEqual(false);
      });

      it('should not validate the field when it is dirty', () => {
        component.license = null;
        component.ngOnChanges();
        component.formControl.markAsDirty();
        fixture.detectChanges();
        const result: boolean = component.isInvalid();
        expect(result).toEqual(true);
      });
    });
  });
});

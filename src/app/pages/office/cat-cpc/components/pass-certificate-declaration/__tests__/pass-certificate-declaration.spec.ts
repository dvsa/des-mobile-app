import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { PipesModule } from '@shared/pipes/pipes.module';
import { PassCertificateDeclarationComponent } from '../pass-certificate-declaration';

describe('PassCertificateDeclarationComponent', () => {
  let fixture: ComponentFixture<PassCertificateDeclarationComponent>;
  let component: PassCertificateDeclarationComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PassCertificateDeclarationComponent,
      ],
      imports: [
        IonicModule,
        PipesModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PassCertificateDeclarationComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('Class', () => {
    describe('passCertificateDeclarationChanged', () => {
      it('should emit selected value - true', () => {
        spyOn(component.passCertificateDeclarationChange, 'emit');
        component.passCertificateDeclarationChanged(true);
        expect(component.passCertificateDeclarationChange.emit).toHaveBeenCalledWith(true);
      });
      it('should emit selected value - false', () => {
        spyOn(component.passCertificateDeclarationChange, 'emit');
        component.passCertificateDeclarationChanged(false);
        expect(component.passCertificateDeclarationChange.emit).toHaveBeenCalledWith(false);
      });
    });

    describe('invalid', () => {
      it('should validate the field when it is valid', () => {
        component.ngOnChanges();
        component.formGroup.get(PassCertificateDeclarationComponent.fieldName).setValue(true);
        fixture.detectChanges();
        const result: boolean = component.invalid;
        expect(result).toEqual(false);
      });
      it('should not validate the field when it is dirty', () => {
        component.ngOnChanges();
        component.formControl.markAsDirty();
        fixture.detectChanges();
        const result: boolean = component.invalid;
        expect(result).toEqual(true);
      });
    });
  });
});

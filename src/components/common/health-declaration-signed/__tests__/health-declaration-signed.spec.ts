import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { HealthDeclarationSignedComponent } from '../health-declaration-signed';

describe('HealthDeclarationSignedComponent', () => {
  let fixture: ComponentFixture<HealthDeclarationSignedComponent>;
  let component: HealthDeclarationSignedComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        HealthDeclarationSignedComponent,
      ],
      imports: [
        IonicModule,
        ReactiveFormsModule,
      ],
    });

    fixture = TestBed.createComponent(HealthDeclarationSignedComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('Class', () => {
    describe('healthDeclarationChanged', () => {
      it('should emit selected value - true', () => {
        spyOn(component.healthDeclarationChange, 'emit');
        component.healthDeclarationChanged('Signed');
        expect(component.healthDeclarationChange.emit).toHaveBeenCalledWith(true);
      });

      it('should emit selected value - false', () => {
        spyOn(component.healthDeclarationChange, 'emit');
        component.healthDeclarationChanged('NotSigned');
        expect(component.healthDeclarationChange.emit).toHaveBeenCalledWith(false);
      });
    });

    describe('invalid', () => {
      it('should validate the field when it is valid', () => {
        component.ngOnChanges();
        component.formGroup.get(HealthDeclarationSignedComponent.fieldName).setValue(true);
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

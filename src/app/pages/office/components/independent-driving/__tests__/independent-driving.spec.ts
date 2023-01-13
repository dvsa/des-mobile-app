import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IndependentDrivingComponent } from '@pages/office/components/independent-driving/independent-driving';
import {
  ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CircuitType } from '@shared/models/circuit-type';

describe('DangerousFaultBadgeComponent', () => {
  let fixture: ComponentFixture<IndependentDrivingComponent>;
  let component: IndependentDrivingComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(IndependentDrivingComponent);
    component = fixture.componentInstance;
  }));

  describe('getIndependentDrivingInputId', () => {
    it('should return "independent-driving-test" after removing non alpha numeric characters', () => {
      expect(component.getIndependentDrivingInputId('######t###e###s###t')).toBe('independent-driving-test');
    });
  });

  describe('componentWarningMessage', () => {
    it('should return "Select the method of independent driving" if testCategory is driving', () => {
      component.category = TestCategory.B;
      expect(component.componentWarningMessage).toBe('Select the method of independent driving');
    });
    it('should return "Select the method of independent riding" if testCategory is riding', () => {
      component.category = TestCategory.EUA1M1;
      expect(component.componentWarningMessage).toBe('Select the method of independent riding');
    });
  });

  describe('componentTitle', () => {
    it('should return "Independent driving" if testCategory is driving', () => {
      component.category = TestCategory.B;
      expect(component.componentTitle).toBe('Independent driving');
    });
    it('should return "Independent riding" if testCategory is riding', () => {
      component.category = TestCategory.EUA1M1;
      expect(component.componentTitle).toBe('Independent riding');
    });
  });

  describe('ngOnChanges', () => {
    it('should clear validators from FormControl if visibilityType is VisibilityType.NotVisible', () => {
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl('independentDriving', component.formControl);
      component.formGroup.get('independentDriving').setValidators([Validators.required]);

      spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').and.returnValue(VisibilityType.NotVisible);
      component.ngOnChanges();

      expect(component.formGroup.get('independentDriving').hasValidator(Validators.required)).toBe(false);
    });
    it('should set validators to FormControl if visibilityType is not VisibilityType.NotVisible', () => {
      component.formGroup = new UntypedFormGroup({});

      spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').and.returnValue(VisibilityType.Visible);
      component.ngOnChanges();

      expect(component.formGroup.get('independentDriving').hasValidator(Validators.required)).toBe(true);
    });
  });

  describe('independentDrivingChanged', () => {
    it('should emit independentDriving while from control is valid', () => {
      spyOn(component.independentDrivingChange, 'emit');
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(1);

      component.independentDrivingChanged('Diagram');
      expect(component.independentDrivingChange.emit).toHaveBeenCalledWith('Diagram');
    });
    it('should not emit independentDriving while from control is not valid', () => {
      spyOn(component.independentDrivingChange, 'emit');
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(null);

      component.independentDrivingChanged('Diagram');
      expect(component.independentDrivingChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(IndependentDrivingComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(IndependentDrivingComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(IndependentDrivingComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formGroup.get(IndependentDrivingComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });
});

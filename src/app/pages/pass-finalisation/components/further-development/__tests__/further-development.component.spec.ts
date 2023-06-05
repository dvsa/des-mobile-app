import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import {
  ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators,
} from '@angular/forms';
import { CircuitType } from '@shared/models/circuit-type';
import { VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { FurtherDevelopmentComponent } from '../further-development.component';

describe('FurtherDevelopmentComponent', () => {
  let component: FurtherDevelopmentComponent;
  let fixture: ComponentFixture<FurtherDevelopmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FurtherDevelopmentComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });

    fixture = TestBed.createComponent(FurtherDevelopmentComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should clear validators from FormControl if visibilityType is VisibilityType.NotVisible', () => {
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(FurtherDevelopmentComponent.fieldName, component.formControl);
      component.formGroup.get(FurtherDevelopmentComponent.fieldName).setValidators([Validators.required]);

      spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').and.returnValue(VisibilityType.NotVisible);
      component.ngOnChanges();

      expect(component.formGroup.get(FurtherDevelopmentComponent.fieldName)
        .hasValidator(Validators.required)).toBe(false);
    });
    it('should set validators to FormControl if visibilityType is not VisibilityType.NotVisible', () => {
      component.formGroup = new UntypedFormGroup({});

      spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').and.returnValue(VisibilityType.Visible);
      component.ngOnChanges();

      expect(component.formGroup.get(FurtherDevelopmentComponent.fieldName)
        .hasValidator(Validators.required)).toBe(true);
    });

    it('should patch furtherDevelopment as a string into formControl if it is false', () => {
      component.furtherDevelopment = false;
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();
      expect(component.formControl.value).toBe('false');
    });
    it('should patch furtherDevelopment as a string into formControl if it is true', () => {
      component.furtherDevelopment = true;
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();
      expect(component.formControl.value).toBe('true');
    });
    it('should not patch furtherDevelopment into formControl if it is neither true nor false', () => {
      component.furtherDevelopment = null;
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(true);
      component.ngOnChanges();

      expect(component.formControl.value).not.toBe(null);
    });
  });

  describe('furtherDevelopmentChanged', () => {
    it('should emit true while from control is valid and the value passed in is "true"', () => {
      spyOn(component.furtherDevelopmentChange, 'emit');
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(1);

      component.furtherDevelopmentChanged('true');
      expect(component.furtherDevelopmentChange.emit).toHaveBeenCalledWith(true);
    });
    it('should emit false while from control is valid and the value passed in is not "true"', () => {
      spyOn(component.furtherDevelopmentChange, 'emit');
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(1);

      component.furtherDevelopmentChanged('test');
      expect(component.furtherDevelopmentChange.emit).toHaveBeenCalledWith(false);
    });
    it('should not emit independentDriving while from control is not valid', () => {
      spyOn(component.furtherDevelopmentChange, 'emit');
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(null);

      component.furtherDevelopmentChanged('test');
      expect(component.furtherDevelopmentChange.emit).not.toHaveBeenCalled();
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

});

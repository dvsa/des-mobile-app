import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators,
} from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { CircuitComponent } from '@pages/office/cat-a-mod1/components/circuit/circuit';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { CircuitType } from '@shared/models/circuit-type';

describe('CircuitComponent', () => {
  let fixture: ComponentFixture<CircuitComponent>;
  let component: CircuitComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProviderMock },
        provideMockStore({ ...{} }),
      ],
    });

    fixture = TestBed.createComponent(CircuitComponent);
    component = fixture.componentInstance;
  }));

  describe('ngOnChanges', () => {
    it('should clear validators from FormControl if visibilityType is VisibilityType.NotVisible', () => {
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(component.formField, component.formControl);
      component.formGroup.get(component.formField).setValidators([Validators.required]);

      spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').and.returnValue(VisibilityType.NotVisible);
      component.ngOnChanges();

      expect(component.formGroup.get(component.formField).hasValidator(Validators.required)).toBe(false);
    });
    it('should set validators to FormControl if visibilityType is not VisibilityType.NotVisible', () => {
      component.formGroup = new UntypedFormGroup({});

      spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').and.returnValue(VisibilityType.Visible);
      component.ngOnChanges();

      expect(component.formGroup.get(component.formField).hasValidator(Validators.required)).toBe(true);
    });
  });

  describe('circuitChanged', () => {
    it('should emit params if formControl is valid ', () => {
      spyOn(component.circuitChange, 'emit');
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(component.formField, component.formControl);
      component.formGroup.get(component.formField).setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.circuitChanged('Left');

      expect(component.circuitChange.emit).toHaveBeenCalledWith('Left');
    });
    it('should not emit params if formControl is invalid ', () => {
      spyOn(component.circuitChange, 'emit');
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(component.formField, component.formControl);
      component.formGroup.get(component.formField).setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.circuitChanged('Left');

      expect(component.circuitChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(component.formField, component.formControl);
      component.formGroup.get(component.formField).setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(component.formField, component.formControl);
      component.formGroup.get(component.formField).setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(component.formField, component.formControl);
      component.formGroup.get(component.formField).setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(component.formField, component.formControl);
      component.formGroup.get(component.formField).setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });
});

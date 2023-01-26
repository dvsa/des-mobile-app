import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from '@pages/office/office-behaviour-map';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CircuitType } from '@shared/models/circuit-type';
import { RouteNumberComponent } from '../route-number';

describe('RouteNumberComponent', () => {
  let fixture: ComponentFixture<RouteNumberComponent>;
  let component: RouteNumberComponent;
  let behaviourMapProvider: OutcomeBehaviourMapProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RouteNumberComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
      providers: [
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(RouteNumberComponent);
    behaviourMapProvider = TestBed.inject(OutcomeBehaviourMapProvider);
    behaviourMapProvider.setBehaviourMap(behaviourMap);
    component = fixture.componentInstance;
  }));

  describe('class', () => {
    it('should emit route number if 1 character', () => {
      spyOn(component.routeNumberChange, 'emit');
      const routeNumber = '7';
      component.routeNumberChanged(routeNumber);
      expect(component.routeNumberChange.emit).toHaveBeenCalledWith(Number.parseInt(routeNumber, 10));
    });

    it('should emit route number if 2 characters', () => {
      spyOn(component.routeNumberChange, 'emit');
      const routeNumber = '44';
      component.routeNumberChanged(routeNumber);
      expect(component.routeNumberChange.emit).toHaveBeenCalledWith(Number.parseInt(routeNumber, 10));
    });

    it('should emit no route number if not numeric', () => {
      spyOn(component.routeNumberChange, 'emit');
      const routeNumber = 'ABC123';
      component.routeNumberChanged(routeNumber);
      expect(component.routeNumberChange.emit).toHaveBeenCalledWith(null);
    });
  });

  describe('ngOnChanges', () => {
    it('should clear validators from FormControl if visibilityType is VisibilityType.NotVisible', () => {
      component.formControl = new UntypedFormControl(CircuitType.Left);
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl(RouteNumberComponent.fieldName, component.formControl);
      component.formGroup.get(RouteNumberComponent.fieldName).setValidators([Validators.required]);

      spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').and.returnValue(VisibilityType.NotVisible);
      component.ngOnChanges();

      expect(component.formGroup.get(RouteNumberComponent.fieldName).hasValidator(Validators.required)).toBe(false);
    });
    it('should set validators to FormControl if visibilityType is not VisibilityType.NotVisible', () => {
      component.formGroup = new UntypedFormGroup({});

      spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').and.returnValue(VisibilityType.Visible);
      component.ngOnChanges();

      expect(component.formGroup.get(RouteNumberComponent.fieldName).hasValidator(Validators.required)).toBe(true);
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

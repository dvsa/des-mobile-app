import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { VehicleDetailsCatCPCComponent } from '../vehicle-details';

describe('VehicleDetailsCatCPCComponent', () => {
  let fixture: ComponentFixture<VehicleDetailsCatCPCComponent>;
  let component: VehicleDetailsCatCPCComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleDetailsCatCPCComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleDetailsCatCPCComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);

  }));

  describe('ngOnChanges', () => {
    it('should have fieldName form control be added to '
            + 'form if there is no form control already there', () => {
      component.formControl = null;
      component.ngOnChanges();

      expect(component.formGroup.controls[VehicleDetailsCatCPCComponent.fieldName])
        .toBeTruthy();
    });
    it('should patch control with value stored in combination ', () => {
      component.configuration = 'Rigid';

      component.ngOnChanges();
      expect(component.formControl.value)
        .toEqual('Rigid');
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid)
        .toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid)
        .toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid)
        .toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid)
        .toBeFalsy();
    });
  });

  describe('vehicleDetailsChanged', () => {
    it('should emit the value passed into the function', () => {
      spyOn(component.vehicleDetailsChange, 'emit');
      component.vehicleDetailsChanged('Rigid');
      expect(component.vehicleDetailsChange.emit)
        .toHaveBeenCalledWith('Rigid');
    });
  });
});

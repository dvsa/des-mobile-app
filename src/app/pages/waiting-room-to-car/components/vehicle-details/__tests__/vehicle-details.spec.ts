import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import {
  UntypedFormControl, UntypedFormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { AppModule } from '@app/app.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { VehicleDetailsComponent } from '../vehicle-details';

describe('VehicleDetailsComponent', () => {
  let fixture: ComponentFixture<VehicleDetailsComponent>;
  let component: VehicleDetailsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleDetailsComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
        PipesModule,
      ],
    });

    fixture = TestBed.createComponent(VehicleDetailsComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('vehicleDetailsChanged', () => {
    it('should emit vehicleDetailsChange if formControl is valid', () => {
      component.formControl = new UntypedFormControl(null, [Validators.required]);
      component.formControl.setValue(1);
      spyOn(component.vehicleDetailsChange, 'emit');
      component.vehicleDetailsChanged();
      expect(component.vehicleDetailsChange.emit)
        .toHaveBeenCalled();
    });
  });

  describe('DOM', () => {
    describe('setting optional vehicle details', () => {
      it('should call vehicleDetailsChanged when school car is selected', () => {
        spyOn(component, 'vehicleDetailsChanged');
        component.vehicleDetailsType = 'School car';
        component.ngOnChanges();
        fixture.detectChanges();
        const schoolCarCb = fixture.debugElement.query(By.css(`#${component.formControlName}`));
        schoolCarCb.triggerEventHandler('change', { target: {} });
        fixture.detectChanges();
        expect(component.vehicleDetailsChanged)
          .toHaveBeenCalled();
      });
      it('should call vehicleDetailsChanged when dual controls is selected', () => {
        spyOn(component, 'vehicleDetailsChanged');
        component.vehicleDetailsType = 'Dual control';
        component.ngOnChanges();
        fixture.detectChanges();
        const dualControlCb = fixture.debugElement.query(By.css(`#${component.formControlName}`));
        dualControlCb.triggerEventHandler('change', { target: {} });
        fixture.detectChanges();
        expect(component.vehicleDetailsChanged)
          .toHaveBeenCalled();
      });
    });
  });
});

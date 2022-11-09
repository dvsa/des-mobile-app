import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  UntypedFormGroup, ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import {
  VehicleDetailsCardComponent,
} from '@pages/waiting-room-to-car/components/vehicle-details-card/vehicle-details-card';
import { AppModule } from '@app/app.module';

describe('VehicleDetailsCardComponent', () => {
  let fixture: ComponentFixture<VehicleDetailsCardComponent>;
  let component: VehicleDetailsCardComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleDetailsCardComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleDetailsCardComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('schoolVehicleDetailsChanged', () => {
    it('should emit the correct event', () => {
      spyOn(component.schoolVehicleDetailsChange, 'emit');
      component.schoolVehicleDetailsChanged();
      expect(component.schoolVehicleDetailsChange.emit).toHaveBeenCalled();
    });
  });
  describe('dualVehicleDetailsChanged', () => {
    it('should emit the correct event', () => {
      spyOn(component.dualVehicleDetailsChange, 'emit');
      component.dualVehicleDetailsChanged();
      expect(component.dualVehicleDetailsChange.emit).toHaveBeenCalled();
    });
  });
  describe('schoolBikeVehicleDetailsChanged', () => {
    it('should emit the correct event', () => {
      spyOn(component.schoolBikeVehicleDetailsChange, 'emit');
      component.schoolBikeVehicleDetailsChanged();
      expect(component.schoolBikeVehicleDetailsChange.emit).toHaveBeenCalled();
    });
  });
});

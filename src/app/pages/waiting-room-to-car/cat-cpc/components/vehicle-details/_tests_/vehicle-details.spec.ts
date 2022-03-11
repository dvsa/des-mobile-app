import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
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
    component.formGroup = new FormGroup({});
  }));

  describe('vehicleDetailsChanged', () => {
    it('should emit the value passed into the function', () => {
      spyOn(component.vehicleDetailsChange, 'emit');
      component.vehicleDetailsChanged('Rigid');
      expect(component.vehicleDetailsChange.emit).toHaveBeenCalledWith('Rigid');
    });
  });
});

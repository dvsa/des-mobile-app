import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { VehicleDetailsComponent } from '../vehicle-details';

describe('VehicleDetailsComponent', () => {
  let fixture: ComponentFixture<VehicleDetailsComponent>;
  let component: VehicleDetailsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleDetailsComponent,
      ],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(VehicleDetailsComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});

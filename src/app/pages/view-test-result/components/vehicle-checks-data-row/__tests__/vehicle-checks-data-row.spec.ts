import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { VehicleChecksDataRowComponent } from '../vehicle-checks-data-row';

describe('VehicleChecksDataRowComponent', () => {
  let fixture: ComponentFixture<VehicleChecksDataRowComponent>;
  let component: VehicleChecksDataRowComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksDataRowComponent,
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleChecksDataRowComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('shouldShowFault', () => {
      it('should return true if outcome is a DF', () => {
        expect(component.shouldShowFault('DF')).toEqual(true);
      });
      it('should return false if outcome is not a DF', () => {
        expect(component.shouldShowFault('P')).toEqual(false);
        expect(component.shouldShowFault('D')).toEqual(false);
        expect(component.shouldShowFault('S')).toEqual(false);
      });
    });
  });
});

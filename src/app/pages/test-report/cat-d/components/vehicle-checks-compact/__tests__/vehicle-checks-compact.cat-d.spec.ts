import { StoreModel } from '@shared/models/store.model';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { IonicModule } from '@ionic/angular';
import { testsReducer } from '@store/tests/tests.reducer';
import { StartTest } from '@store/tests/tests.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { VehicleChecksCompactCatDComponent } from '../vehicle-checks-compact.cat-d';

describe('VehicleChecksCompactComponent', () => {
  let fixture: ComponentFixture<VehicleChecksCompactCatDComponent>;
  let component: VehicleChecksCompactCatDComponent;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCompactCatDComponent,
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DrivingFaultsBadgeComponent),
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        FaultCountProvider,
        TestDataByCategoryProvider,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleChecksCompactCatDComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.D));
  }));

  describe('Class', () => {
    const vehicleChecksScore: VehicleChecksScore = {
      drivingFaults: 4,
      seriousFaults: 1,
    };

    beforeEach(() => {
      spyOn(component.faultCountProvider, 'getVehicleChecksFaultCount').and.returnValue(vehicleChecksScore);
    });

    it('should set the vehicle checks driving fault count', (done: DoneFn) => {
      component.testCategory = TestCategory.D;
      component.ngOnInit();
      component.componentState.vehicleChecksDrivingFaultCount$.subscribe((result) => {
        expect(component.faultCountProvider.getVehicleChecksFaultCount).toHaveBeenCalled();
        expect(result).toEqual(4);
        done();
      });
    });
    it('should set the vehicle checks serious fault count', (done: DoneFn) => {
      component.testCategory = TestCategory.D;
      component.ngOnInit();
      component.componentState.vehicleChecksSeriousFaultCount$.subscribe((result) => {
        expect(component.faultCountProvider.getVehicleChecksFaultCount).toHaveBeenCalled();
        expect(result).toEqual(1);
        done();
      });
    });
  });

  describe('DOM', () => {
    it('should pass the number of VC driving faults to the driving faults component', () => {
      component.testCategory = TestCategory.D;
      fixture.detectChanges();
      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;
      component.componentState.vehicleChecksDrivingFaultCount$ = of(3);
      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(3);
    });

    it('should pass true to the serious faults badge if there are serious VC faults', () => {
      component.testCategory = TestCategory.D;
      fixture.detectChanges();
      const seriousFaultsBadge = fixture.debugElement.query(By.css('serious-fault-badge'))
        .componentInstance as SeriousFaultBadgeComponent;
      component.componentState.vehicleChecksSeriousFaultCount$ = of(1);
      fixture.detectChanges();
      expect(seriousFaultsBadge.showBadge).toEqual(true);
    });
  });

});

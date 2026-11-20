import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Store, StoreModule } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { StoreModel } from '@shared/models/store.model';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { StartTest } from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { MockComponent } from 'ng-mocks';
import { VehicleChecksComponent } from '../vehicle-checks';

describe('VehicleChecksComponent', () => {
  let fixture: ComponentFixture<VehicleChecksComponent>;
  let component: VehicleChecksComponent;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
        VehicleChecksComponent,
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DrivingFaultsBadgeComponent),
      ],
      providers: [FaultCountProvider, TestDataByCategoryProvider],
    });

    fixture = TestBed.createComponent(VehicleChecksComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.C));
  });

  describe('Class', () => {
    const vehicleChecksScore: VehicleChecksScore = {
      drivingFaults: 4,
      seriousFaults: 1,
    };

    beforeEach(() => {
      vi.spyOn(component.faultCountProvider, 'getVehicleChecksFaultCount').mockReturnValue(vehicleChecksScore);
    });

    it('should set the vehicle checks driving fault count', () => {
      component.testCategory = TestCategory.C;
      fixture.detectChanges();
      const result = component.vehicleChecksDrivingFaultCount();
      expect(component.faultCountProvider.getVehicleChecksFaultCount).toHaveBeenCalled();
      expect(result).toEqual(4);
    });
    it('should set the vehicle checks serious fault count', () => {
      component.testCategory = TestCategory.C;
      fixture.detectChanges();
      const result = component.vehicleChecksSeriousFaultCount();
      expect(component.faultCountProvider.getVehicleChecksFaultCount).toHaveBeenCalled();
      expect(result).toEqual(1);
    });
  });
});

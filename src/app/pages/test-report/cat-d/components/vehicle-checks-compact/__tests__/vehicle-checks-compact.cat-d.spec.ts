import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { MockComponent } from 'ng-mocks';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { StartTest } from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { VehicleChecksCompactCatDComponent } from '../vehicle-checks-compact.cat-d';

describe('VehicleChecksCompactComponent', () => {
  let fixture: ComponentFixture<VehicleChecksCompactCatDComponent>;
  let component: VehicleChecksCompactCatDComponent;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
        VehicleChecksCompactCatDComponent,
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DrivingFaultsBadgeComponent),
      ],
      providers: [FaultCountProvider, TestDataByCategoryProvider],
    });

    fixture = TestBed.createComponent(VehicleChecksCompactCatDComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.D));
  });

  describe('Class', () => {
    const vehicleChecksScore: VehicleChecksScore = {
      drivingFaults: 4,
      seriousFaults: 1,
    };

    beforeEach(() => {
      vi.spyOn(component.faultCountProvider, 'getVehicleChecksFaultCount').mockReturnValue(vehicleChecksScore);
    });

    it('should set the vehicle checks driving fault count', async () => {
      component.testCategory = TestCategory.D;
      component.ngOnInit();
      const result = await firstValueFrom(component.componentState.vehicleChecksDrivingFaultCount$);
      expect(component.faultCountProvider.getVehicleChecksFaultCount).toHaveBeenCalled();
      expect(result).toEqual(4);
    });
    it('should set the vehicle checks serious fault count', async () => {
      component.testCategory = TestCategory.D;
      component.ngOnInit();
      const result = await firstValueFrom(component.componentState.vehicleChecksSeriousFaultCount$);
      expect(component.faultCountProvider.getVehicleChecksFaultCount).toHaveBeenCalled();
      expect(result).toEqual(1);
    });
  });
});

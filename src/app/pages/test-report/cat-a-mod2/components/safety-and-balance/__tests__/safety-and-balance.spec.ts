import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Store, StoreModule } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { StoreModel } from '@shared/models/store.model';
import { StartTest } from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { SafetyAndBalanceComponent } from '../safety-and-balance';

describe('SafetyAndBalanceComponent', () => {
  let fixture: ComponentFixture<SafetyAndBalanceComponent>;
  let component: SafetyAndBalanceComponent;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
        SafetyAndBalanceComponent,
        MockComponent(DrivingFaultsBadgeComponent),
      ],
      providers: [FaultCountProvider],
    });

    fixture = TestBed.createComponent(SafetyAndBalanceComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.EUA2M2));
  });

  describe('Class', () => {
    const safetyAndBalanceScore: SafetyQuestionsScore = {
      drivingFaults: 1,
    };

    beforeEach(() => {
      vi.spyOn(component.faultCountProvider, 'getSafetyAndBalanceFaultCount').mockReturnValue(safetyAndBalanceScore);
    });

    it('should set the safety and balance questions riding fault count', async () => {
      component.ngOnInit();
      const result = await firstValueFrom(component.componentState.safetyAndBalanceDrivingFaultCount$);
      expect(component.faultCountProvider.getSafetyAndBalanceFaultCount).toHaveBeenCalled();
      expect(result).toEqual(1);
    });
  });

  describe('DOM', () => {
    beforeEach(() => {
      vi.spyOn(component.faultCountProvider, 'getSafetyAndBalanceFaultCount').mockReturnValue({ drivingFaults: 1 });
    });

    it('should pass the number of S&B riding faults to the driving faults component', () => {
      fixture.detectChanges();
      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;
      component.componentState.safetyAndBalanceDrivingFaultCount$ = of(1);
      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(1);
    });
  });
});

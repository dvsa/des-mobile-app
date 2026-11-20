import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { beforeEach, describe, expect, it } from 'vitest';

import { Store, StoreModule } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { StoreModel } from '@shared/models/store.model';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { AddDrivingFault } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { selectTestData } from '@store/tests/test-data/common/test-data.selector';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { StartTest } from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { DrivingFaultSummaryComponent } from '../driving-fault-summary';

describe('DrivingFaultSummary', () => {
  let fixture: ComponentFixture<DrivingFaultSummaryComponent>;
  let component: DrivingFaultSummaryComponent;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ tests: testsReducer }), DrivingFaultSummaryComponent],
      providers: [FaultCountProvider],
    });

    fixture = TestBed.createComponent(DrivingFaultSummaryComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
  });

  describe('DOM', () => {
    let componentEl: DebugElement;

    beforeEach(() => {
      componentEl = fixture.debugElement;

      store$.dispatch(StartTest(103, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      fixture.componentRef.setInput('testCategory', TestCategory.B);
      fixture.componentRef.setInput('testData', store$.selectSignal(selectTestData)());
    });

    it('should display 0 driving faults for a new test', () => {
      fixture.detectChanges();
      const summaryCount: HTMLElement = componentEl.query(By.css('#summary-count')).nativeElement;
      expect(summaryCount.textContent).toBe('0');
    });

    it('should display 3 driving faults when 3 driving faults have been marked', () => {
      store$.dispatch(AddDrivingFault({ competency: Competencies.clearance, newFaultCount: 1 }));
      store$.dispatch(AddDrivingFault({ competency: Competencies.controlsSteering, newFaultCount: 1 }));
      store$.dispatch(AddDrivingFault({ competency: Competencies.moveOffControl, newFaultCount: 1 }));

      fixture.componentRef.setInput('testData', store$.selectSignal(selectTestData)());
      fixture.detectChanges();

      const summaryCount: HTMLElement = componentEl.query(By.css('#summary-count')).nativeElement;
      expect(summaryCount.textContent).toBe('3');
    });
  });

  describe('driverTypeSwitch', () => {
    it('should return R when a category equals EUAM1,', () => {
      const driverTypeTest = component.driverTypeSwitch(TestCategory.EUAM1);
      expect(driverTypeTest).toEqual('R');
    });

    it('should return R when a category equals EUAM2', () => {
      const driverTypeTest = component.driverTypeSwitch(TestCategory.EUAM2);
      expect(driverTypeTest).toEqual('R');
    });

    it('should return D when a category equals B', () => {
      const driverTypeTest = component.driverTypeSwitch(TestCategory.B);
      expect(driverTypeTest).toEqual('D');
    });

    it('should return D when a category equals B+E', () => {
      const driverTypeTest = component.driverTypeSwitch(TestCategory.BE);
      expect(driverTypeTest).toEqual('D');
    });
  });
});

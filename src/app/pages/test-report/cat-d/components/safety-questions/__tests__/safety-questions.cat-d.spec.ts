import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { MockComponent } from 'ng-mocks';

import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { StartTest } from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { SafetyQuestionsCatDComponent } from '../safety-questions.cat-d';

describe('SafetyQuestionsComponent', () => {
  let fixture: ComponentFixture<SafetyQuestionsCatDComponent>;
  let component: SafetyQuestionsCatDComponent;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SafetyQuestionsCatDComponent, MockComponent(DrivingFaultsBadgeComponent)],
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [FaultCountProvider, TestDataByCategoryProvider],
    });

    fixture = TestBed.createComponent(SafetyQuestionsCatDComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.D));
  });

  describe('Class', () => {
    const safetyQuestionsScore: SafetyQuestionsScore = {
      drivingFaults: 1,
    };

    beforeEach(() => {
      spyOn(component.faultCountProvider, 'getSafetyQuestionsFaultCount').and.returnValue(safetyQuestionsScore);
    });

    it('should set the safety questions driving fault count', (done: DoneFn) => {
      component.testCategory = TestCategory.D;
      component.ngOnInit();
      component.componentState.safetyQuestionsDrivingFaultCount$.subscribe((result) => {
        expect(component.faultCountProvider.getSafetyQuestionsFaultCount).toHaveBeenCalled();
        expect(result).toEqual(1);
        done();
      });
    });
  });
});

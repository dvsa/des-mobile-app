import { StoreModel } from '@shared/models/store.model';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { testsReducer } from '@store/tests/tests.reducer';
import { StartTest } from '@store/tests/tests.actions';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { SafetyQuestionsCatDComponent } from '../safety-questions.cat-d';

describe('SafetyQuestionsComponent', () => {
  let fixture: ComponentFixture<SafetyQuestionsCatDComponent>;
  let component: SafetyQuestionsCatDComponent;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SafetyQuestionsCatDComponent,
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
    fixture = TestBed.createComponent(SafetyQuestionsCatDComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.D));
  }));

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

  describe('DOM', () => {
    it('should pass the number of safety Question driving faults to the driving faults component', () => {
      component.testCategory = TestCategory.D;
      fixture.detectChanges();
      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;
      component.componentState.safetyQuestionsDrivingFaultCount$ = of(1);
      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(1);
    });
  });

});

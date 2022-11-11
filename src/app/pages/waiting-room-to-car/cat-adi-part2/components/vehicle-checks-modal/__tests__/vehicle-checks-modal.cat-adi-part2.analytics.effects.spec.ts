import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ReplaySubject } from 'rxjs';
import { testsReducer } from '@store/tests/tests.reducer';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import * as testsActions from '@store/tests/tests.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsEventCategories, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import * as VehicleChecksActions
  from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.action';
import {
  QuestionOutcome,
  QuestionResult,
} from '@dvsa/mes-test-schema/categories/common';
import { VehicleChecksViewDidEnter } from '../vehicle-checks-modal.cat-adi-part2.actions';
import { VehicleChecksModalAnalyticsEffects } from '../vehicle-checks-modal.cat-adi-part2.analytics.effects';

describe('VehicleChecksModalAnalyticsEffects', () => {
  let effects: VehicleChecksModalAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.VEHICLE_CHECKS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        VehicleChecksModalAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(VehicleChecksModalAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
    spyOn(analyticsProviderMock, 'logEvent');
  });

  describe('vehicleChecksModalViewDidEnter$ effect', () => {
    it('should call analytics.setCurrentPage', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.ADI2));
      actions$.next(VehicleChecksViewDidEnter());
      effects.vehicleChecksModalViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });

  describe('tellMeQuestionChanged$ effect', () => {
    const questionNumber: number = 1;
    const tellMeQuestion: QuestionResult = {
      code: 'T1',
    };
    it('should log an analyics event with tell me question info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.ADI2));
      actions$.next(VehicleChecksActions.TellMeQuestionSelected(tellMeQuestion, questionNumber));
      effects.tellMeQuestionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.VEHICLE_CHECKS,
          `tell me question ${questionNumber + 1} changed`,
          tellMeQuestion.code,
        );
        done();
      });
    });
  });

  describe('tellMeQuestionOutComeChanged$', () => {
    const questionOutcome: QuestionOutcome = 'DF';
    const questionNumber: number = 1;
    it('should log an analytics event with tell me question outcome info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.ADI2));
      actions$.next(VehicleChecksActions.TellMeQuestionOutcomeChanged(questionOutcome, questionNumber));
      effects.tellMeQuestionOutComeChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.VEHICLE_CHECKS,
          `tell me question ${questionNumber + 1} outcome changed`,
          'driving fault',
        );
        done();
      });
    });
  });

});

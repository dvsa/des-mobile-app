import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { StoreModule, Store } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { StoreModel } from '@shared/models/store.model';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { RekeyUploadOutcomeAnalyticsEffects } from '../rekey-upload-outcome.analytics.effects';
import * as rekeyUploadedActions from '../rekey-upload-outcome.actions';

describe('RekeyUploadOutcomeAnalyticsEffects', () => {
  let effects: RekeyUploadOutcomeAnalyticsEffects;
  let analyticsProviderMock;
  let actions$: any;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.REKEY_UPLOADED;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        RekeyUploadOutcomeAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
        Store,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(RekeyUploadOutcomeAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  }));

  describe('rekeyUploadedViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(rekeyUploadedActions.RekeyUploadOutcomeViewDidEnter());
      // ASSERT
      effects.rekeyUploadedViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });

});

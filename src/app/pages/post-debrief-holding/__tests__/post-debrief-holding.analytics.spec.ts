import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModel } from '@shared/models/store.model';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsEventCategories, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import { PostDebriefHoldingAnalyticsEffects } from '../post-debrief-holding.analytics.effects';
import * as postDebriefHoldingActions from '../post-debrief-holding.actions';

describe('PostDebriefHoldingAnalyticsEffects', () => {
  let effects: PostDebriefHoldingAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.POST_DEBRIEF_HOLDING;
  const practiceScreenName = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.POST_DEBRIEF_HOLDING}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        PostDebriefHoldingAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(PostDebriefHoldingAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  });

  describe('backToOfficeViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(postDebriefHoldingActions.PostDebriefHoldingViewDidEnter());
      // ASSERT
      effects.postDebriefHoldingViewDidEnterEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenName);
        done();
      });
    });
    it('should call setCurrentPage with practice mode prefix', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(postDebriefHoldingActions.PostDebriefHoldingViewDidEnter());
      // ASSERT
      effects.postDebriefHoldingViewDidEnterEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(practiceScreenName);
        done();
      });
    });
  });

});

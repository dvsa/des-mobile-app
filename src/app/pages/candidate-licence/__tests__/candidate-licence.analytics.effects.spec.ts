import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Application } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { CandidateLicenceAnalyticsEffects } from '@pages/candidate-licence/candidate-licence.analytics.effects';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsScreenNames, GoogleAnalyticsEventPrefix } from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { StoreModel } from '@shared/models/store.model';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import * as applicationReferenceActions from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject } from 'rxjs';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as candidateLicenceActions from '../candidate-licence.actions';

describe('CommunicationAnalyticsEffects', () => {
  let effects: CandidateLicenceAnalyticsEffects;
  let analyticsProviderMock;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.CANDIDATE_LICENCE_INFO;
  const mockApplication: Application = {
    applicationId: 123456,
    bookingSequence: 78,
    checkDigit: 9,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        CandidateLicenceAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: Router,
          useValue: { url: `/${TestFlowPageNames.CANDIDATE_LICENCE_PAGE}` },
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
    effects = TestBed.inject(CandidateLicenceAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  }));

  describe('candidateLicenceInfoViewDidEnter', () => {
    it('should call setCurrentPage and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(candidateLicenceActions.CandidateLicenceViewDidEnter());
      // ASSERT
      effects.candidateLicenceInfoViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
    it('should call setCurrentPage with practice mode prefix and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(candidateLicenceActions.CandidateLicenceViewDidEnter());
      // ASSERT
      effects.candidateLicenceInfoViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenName}`
        );
        done();
      });
    });
  });
});

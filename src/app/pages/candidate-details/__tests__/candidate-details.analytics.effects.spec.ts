import { TestBed, waitForAsync } from '@angular/core/testing';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { CandidateDetailsAnalyticsEffects } from '@pages/candidate-details/candidate-details.analytics.effects';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsDimensionIndices,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
} from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { StoreModel } from '@shared/models/store.model';
import { testsReducer } from '@store//tests/tests.reducer';
import {
  CandidateDetailsModalDismiss,
  CandidateDetailsSlotChangeViewed,
  CandidateDetailsViewDidEnter,
} from '@store/candidate-details/candidate-details.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as testsActions from '@store/tests/tests.actions';
import { ReplaySubject } from 'rxjs';

describe('CandidateDetailsAnalyticsEffects', () => {
  let effects: CandidateDetailsAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.CANDIDATE_DETAILS;
  const mockTestSlot = {
    booking: {
      candidate: {
        candidateId: 123,
      },
      application: {
        specialNeeds: 'needs',
        entitlementCheck: true,
      },
    },
  } as TestSlot;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        CandidateDetailsAnalyticsEffects,
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
    effects = TestBed.inject(CandidateDetailsAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
    spyOn(analyticsProviderMock, 'logEvent');
  }));

  describe('candidateView$', () => {
    it('should call setCurrentPage', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(CandidateDetailsViewDidEnter({ slot: mockTestSlot }));
      // ASSERT
      effects.candidateView$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
          AnalyticsDimensionIndices.CANDIDATE_ID,
          '123'
        );
        expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
          AnalyticsDimensionIndices.CANDIDATE_WITH_SPECIAL_NEEDS,
          '1'
        );
        expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
          AnalyticsDimensionIndices.CANDIDATE_WITH_CHECK,
          '1'
        );
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);

        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
          GoogleAnalyticsCustomDimension.CANDIDATE_ID,
          '123'
        );
        expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
          GoogleAnalyticsCustomDimension.CANDIDATE_WITH_SPECIAL_NEEDS,
          '1'
        );
        expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
          GoogleAnalyticsCustomDimension.CANDIDATE_WITH_CHECK,
          '1'
        );
        done();
      });
    });
  });
  describe('candidateModalDismiss$', () => {
    it('should set analytic data to null and stamp page with source', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(CandidateDetailsModalDismiss({ sourcePage: 'JournalPage' }));
      // ASSERT
      effects.candidateModalDismiss$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
          AnalyticsDimensionIndices.CANDIDATE_ID,
          null
        );
        expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
          AnalyticsDimensionIndices.CANDIDATE_WITH_SPECIAL_NEEDS,
          null
        );
        expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
          AnalyticsDimensionIndices.CANDIDATE_WITH_CHECK,
          null
        );
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(AnalyticsScreenNames.JOURNAL);

        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(AnalyticsScreenNames.JOURNAL);
        expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
          GoogleAnalyticsCustomDimension.CANDIDATE_ID,
          null
        );
        expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
          GoogleAnalyticsCustomDimension.CANDIDATE_WITH_SPECIAL_NEEDS,
          null
        );
        expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
          GoogleAnalyticsCustomDimension.CANDIDATE_WITH_CHECK,
          null
        );
        done();
      });
    });
  });
  describe('slotChangeViewed$', () => {
    it('should dispatch logEvent with slotId', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(CandidateDetailsSlotChangeViewed({ slotId: 123 }));
      // ASSERT
      effects.slotChangeViewed$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.JOURNAL,
          AnalyticsEvents.SLOT_CHANGE_VIEWED,
          '123'
        );

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.SLOT_VIEWED,
          '123'
        );
        done();
      });
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { CandidateDetailsAnalyticsEffects } from '@pages/candidate-details/candidate-details.analytics.effects';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
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
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

describe('CandidateDetailsAnalyticsEffects', () => {
  let effects: CandidateDetailsAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
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

  beforeEach(() => {
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
  });

  describe('candidateView$', () => {
    it('should call setCurrentPage', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(CandidateDetailsViewDidEnter({ slot: mockTestSlot }));
      const result = await firstValueFrom(effects.candidateView$);
      expect(result.type).toEqual(AnalyticRecorded.type);
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
    });
  });
  describe('candidateModalDismiss$', () => {
    it('should set analytic data to null and stamp page with source', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(CandidateDetailsModalDismiss({ sourcePage: 'JournalPage' }));
      const result = await firstValueFrom(effects.candidateModalDismiss$);
      expect(result.type).toEqual(AnalyticRecorded.type);
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
    });
  });
  describe('slotChangeViewed$', () => {
    it('should dispatch logEvent with slotId', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(CandidateDetailsSlotChangeViewed({ slotId: 123 }));
      const result = await firstValueFrom(effects.slotChangeViewed$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.SLOT_VIEWED,
        '123'
      );
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsScreenNames, GoogleAnalyticsEventPrefix } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { StoreModel } from '@shared/models/store.model';
import * as testsActions from '@store/tests/tests.actions';
import * as candidateActions from '@store/tests/journal-data/common/candidate/candidate.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import * as rekeyReasonActions from '../rekey-reason.actions';
import { RekeyReasonAnalyticsEffects } from '../rekey-reason.analytics.effects';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';

describe('RekeyReasonAnalyticsEffects', () => {
  let effects: RekeyReasonAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.REKEY_REASON;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        RekeyReasonAnalyticsEffects,
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
    effects = TestBed.inject(RekeyReasonAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);

  });

  describe('rekeyReasonViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(candidateActions.PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(rekeyReasonActions.RekeyReasonViewDidEnter());
      // ASSERT
      effects.rekeyReasonViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(screenName);
        done();
      });
    });

    it('should call setCurrentPage with pass and practice mode prefix', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(candidateActions.PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(rekeyReasonActions.RekeyReasonViewDidEnter());
      // ASSERT
      effects.rekeyReasonViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);

        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(`${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenName}`);
        done();
      });
    });
  });

  describe('rekeyReasonUploadTest$', () => {
    it('should call log event', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(candidateActions.PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(rekeyReasonActions.RekeyUploadTest());
      // ASSERT
      effects.rekeyReasonUploadTest$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalled();
        done();
      });
    });
  });
});

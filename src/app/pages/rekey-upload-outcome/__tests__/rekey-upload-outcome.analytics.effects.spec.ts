import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsScreenNames, GoogleAnalyticsEventPrefix } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { StoreModel } from '@shared/models/store.model';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { RekeyUploadOutcomeAnalyticsEffects } from '../rekey-upload-outcome.analytics.effects';
import * as rekeyUploadedActions from '../rekey-upload-outcome.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';

describe('RekeyUploadOutcomeAnalyticsEffects', () => {
  let effects: RekeyUploadOutcomeAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        RekeyUploadOutcomeAnalyticsEffects,
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
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);

        // GA4 analytics
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(AnalyticsScreenNames.REKEY_UPLOADED);
        done();
      });
    });

    it('should call setCurrentPage and prefix correctly when practice mode', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(rekeyUploadedActions.RekeyUploadOutcomeViewDidEnter());
      // ASSERT
      effects.rekeyUploadedViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);

        // GA4 analytics
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(`${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${AnalyticsScreenNames.REKEY_UPLOADED}`);
        done();
      });
    });

  });
});

import { TestBed, waitForAsync } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsErrorTypes,
  AnalyticsEventCategories,
  AnalyticsScreenNames,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
} from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { StoreModel } from '@shared/models/store.model';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject } from 'rxjs';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as healthDeclarationActions from '../health-declaration.actions';
import { HealthDeclarationAnalyticsEffects } from '../health-declaration.analytics.effects';

describe('HealthDeclarationAnalyticsEffects', () => {
  let effects: HealthDeclarationAnalyticsEffects;
  let analyticsProviderMock;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.HEALTH_DECLARATION;
  // eslint-disable-next-line max-len
  const screenNamePracticeMode = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.HEALTH_DECLARATION}`;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        HealthDeclarationAnalyticsEffects,
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
    effects = TestBed.inject(HealthDeclarationAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  }));

  describe('healthDeclarationViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(healthDeclarationActions.HealthDeclarationViewDidEnter());
      // ASSERT
      effects.healthDeclarationViewDidEnter$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);

        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });

    it('should call setCurrentPage with practice mode prefix', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(healthDeclarationActions.HealthDeclarationViewDidEnter());
      // ASSERT
      effects.healthDeclarationViewDidEnter$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenNamePracticeMode);

        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenName}`
        );
        done();
      });
    });
  });

  describe('validationErrorEffect', () => {
    it('should call logError', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      // ACT
      actions$.next(healthDeclarationActions.HealthDeclarationValidationError('error message'));
      // ASSERT
      effects.validationErrorEffect$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logError).toHaveBeenCalledWith(
          `${AnalyticsErrorTypes.VALIDATION_ERROR} (${AnalyticsScreenNames.HEALTH_DECLARATION})`,
          'error message'
        );

        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.VALIDATION_ERROR,
          GoogleAnalyticsEventsTitles.BLANK_FIELD,
          'error message'
        );
        done();
      });
    });

    // TODO - MES-9495 - remove old analytics
    it('should call logError with pass, prefixed with practice mode', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      // eslint-disable-next-line max-len
      const practiceScreenName = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.HEALTH_DECLARATION}`;
      // ACT
      actions$.next(healthDeclarationActions.HealthDeclarationValidationError('error message'));
      // ASSERT
      effects.validationErrorEffect$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logError).toHaveBeenCalledWith(
          `${AnalyticsErrorTypes.VALIDATION_ERROR} (${practiceScreenName})`,
          'error message'
        );
        done();
      });
    });
  });
});

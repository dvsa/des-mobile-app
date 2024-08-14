import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { StoreModel } from '@shared/models/store.model';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import * as healthDeclarationActions from '../health-declaration.actions';
import { HealthDeclarationAnalyticsEffects } from '../health-declaration.analytics.effects';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';

describe('HealthDeclarationAnalyticsEffects', () => {
  let effects: HealthDeclarationAnalyticsEffects;
  let analyticsProviderMock;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.HEALTH_DECLARATION;

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
        expect(result.type)
          .toEqual(AnalyticRecorded.type);

        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(screenName);
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
        expect(result.type)
          .toEqual(AnalyticRecorded.type);

        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(`${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenName}`);
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
        expect(result.type)
          .toEqual(AnalyticRecorded.type);

        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.VALIDATION_ERROR,
            GoogleAnalyticsEventsTitles.BLANK_FIELD,
            'error message');
        done();
      });
    });
  });

});

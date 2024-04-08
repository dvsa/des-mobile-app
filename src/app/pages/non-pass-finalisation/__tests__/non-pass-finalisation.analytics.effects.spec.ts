import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsErrorTypes,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles, GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import * as testsActions from '@store/tests/tests.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as commsActions from '@store/tests/communication-preferences/communication-preferences.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import * as nonPassFinalisationActions from '../non-pass-finalisation.actions';
import { NonPassFinalisationAnalyticsEffects } from '../non-pass-finalisation.analytics.effects';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';

describe('NonPassFinalisationAnalyticsEffects', () => {
  let effects: NonPassFinalisationAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.NON_PASS_FINALISATION;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        NonPassFinalisationAnalyticsEffects,
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
    effects = TestBed.inject(NonPassFinalisationAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
    spyOn(analyticsProviderMock, 'logEvent');
  }));

  describe('nonPassFinalisationViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(nonPassFinalisationActions.NonPassFinalisationViewDidEnter());
      // ASSERT
      effects.nonPassFinalisationViewDidEnterEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenName);
        //GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(screenName);
        done();
      });
    });
    it('should call setCurrentPage with practice mode prefix', (done) => {
      // eslint-disable-next-line max-len
      const practiceScreenName = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.NON_PASS_FINALISATION}`;
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(nonPassFinalisationActions.NonPassFinalisationViewDidEnter());
      // ASSERT
      effects.nonPassFinalisationViewDidEnterEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(practiceScreenName);
        //GA4 Analytics
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
      actions$.next(nonPassFinalisationActions.NonPassFinalisationValidationError('error is blank'));
      // ASSERT
      effects.validationErrorEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(
            `${AnalyticsErrorTypes.VALIDATION_ERROR} (${AnalyticsScreenNames.NON_PASS_FINALISATION})`,
            'error is blank',
          );
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.VALIDATION_ERROR,
            GoogleAnalyticsEventsTitles.BLANK_FIELD,
            'error',
          );
        done();
      });
    });

    it('should call logError with pass, prefixed with practice mode', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      // eslint-disable-next-line max-len
      const practiceScreenName = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.NON_PASS_FINALISATION}`;
      // ACT
      actions$.next(nonPassFinalisationActions.NonPassFinalisationValidationError('error message'));
      // ASSERT
      effects.validationErrorEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(`${AnalyticsErrorTypes.VALIDATION_ERROR} (${practiceScreenName})`,
            'error message');
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.VALIDATION_ERROR,
            GoogleAnalyticsEventsTitles.BLANK_FIELD,
            'error',
          );
        done();
      });
    });
  });
  describe('d255Yes', () => {
    it('should call logEvent', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(testSummaryActions.D255Yes());
      // ASSERT
      effects.d255Yes$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.POST_TEST,
            AnalyticsEvents.D255,
            'Yes',
          );
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.SET_D255,
            GoogleAnalyticsEventsTitles.FINALISATION_D255,
            GoogleAnalyticsEventsValues.YES,
          );
        done();
      });
    });
  });
  describe('d255No', () => {
    it('should call logEvent', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(testSummaryActions.D255No());
      // ASSERT
      effects.d255No$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.POST_TEST,
            AnalyticsEvents.D255,
            'No',
          );
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.SET_D255,
            GoogleAnalyticsEventsTitles.FINALISATION_D255,
            GoogleAnalyticsEventsValues.NO,
          );
        done();
      });
    });
  });
  xdescribe('candidateChoseToProceedWithTestInEnglish$', () => {
    it('should call logEvent with the correct parameters', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(ActivityCodes.PASS));
      // ACT
      actions$.next(commsActions.CandidateChoseToProceedWithTestInEnglish(Language.ENGLISH));
      // ASSERT
      effects.candidateChoseToProceedWithTestInEnglish$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.POST_TEST,
            AnalyticsEvents.LANGUAGE_CHANGED,
            Language.ENGLISH,
          );
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.LANGUAGE_CHANGED,
            GoogleAnalyticsEventsTitles.LANGUAGE,
            Language.ENGLISH,
          );
        done();
      });
    });
    it('should not call logEvent if there is no activity code', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(null));
      // ACT
      actions$.next(commsActions.CandidateChoseToProceedWithTestInEnglish(Language.ENGLISH));
      // ASSERT
      effects.candidateChoseToProceedWithTestInEnglish$.subscribe((result) => {
        expect(result.type === AnalyticNotRecorded.type)
          .toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent)
          .not
          .toHaveBeenCalled();
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .not
          .toHaveBeenCalled();
        done();
      });
    });
  });
  describe('candidateChoseToProceedWithTestInWelsh$', () => {
    it('should not call logEvent if there is no activity code', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(commsActions.CandidateChoseToProceedWithTestInWelsh(Language.CYMRAEG));
      // ASSERT
      effects.candidateChoseToProceedWithTestInWelsh$.subscribe((result) => {
        expect(result.type === AnalyticNotRecorded.type)
          .toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent)
          .not
          .toHaveBeenCalled();
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .not
          .toHaveBeenCalled();
        done();
      });
    });
    it('should call logEvent with the correct parameters', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(ActivityCodes.PASS));
      // ACT
      actions$.next(commsActions.CandidateChoseToProceedWithTestInWelsh(Language.CYMRAEG));
      // ASSERT
      effects.candidateChoseToProceedWithTestInWelsh$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.POST_TEST,
            AnalyticsEvents.LANGUAGE_CHANGED,
            Language.CYMRAEG,
          );
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.LANGUAGE_CHANGED,
            GoogleAnalyticsEventsTitles.LANGUAGE,
            Language.CYMRAEG,
          );
        done();
      });
    });
  });

  describe('NonPassFinalisationReportActivityCode', () => {
    it('should call logEvent for action NonPassFinalisationReportActivityCode', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      // ACT
      actions$.next(nonPassFinalisationActions.NonPassFinalisationReportActivityCode(ActivityCodes.FAIL_PUBLIC_SAFETY));
      // ASSERT
      effects.nonPassFinalisationReportActivityCode$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.POST_TEST,
            AnalyticsEvents.SET_ACTIVITY_CODE,
            '4 - FAIL_PUBLIC_SAFETY',
          );
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.SET_ACTIVITY_CODE,
            GoogleAnalyticsEventsTitles.ACTIVITY_CODE,
            '4 - FAIL_PUBLIC_SAFETY',
          );
        done();
      });
    });
  });

});

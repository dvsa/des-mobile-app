import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import * as testsActions from '@store/tests/tests.actions';
import * as passCompletionActions from '@store/tests/pass-completion/pass-completion.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as vehicleDetailsActions from '@store/tests/vehicle-details/vehicle-details.actions';
import * as commsActions from '@store/tests/communication-preferences/communication-preferences.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { testsReducer } from '@store/tests/tests.reducer';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { ActivityCodes } from '@shared/models/activity-codes';
import { TransmissionType } from '@shared/models/transmission-type';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { StoreModel } from '@shared/models/store.model';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { Router } from '@angular/router';
import { CAT_B } from '@pages/page-names.constants';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as passFinalisationActions from '../pass-finalisation.actions';
import { PassFinalisationAnalyticsEffects } from '../pass-finalisation.analytics.effects';

describe('PassFinalisationAnalyticsEffects', () => {
  let effects: PassFinalisationAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.PASS_FINALISATION;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        PassFinalisationAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: Router,
          useValue: { url: `/${CAT_B.PASS_FINALISATION_PAGE}` },
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
    effects = TestBed.inject(PassFinalisationAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  }));

  describe('passFinalisationViewDidEnter', () => {
    it('should call setCurrentPage and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(passFinalisationActions.PassFinalisationViewDidEnter());
      // ASSERT
      effects.passFinalisationViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(screenName);
        done();
      });
    });
    it('should call setCurrentPage with practice mode prefix and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(passFinalisationActions.PassFinalisationViewDidEnter());
      // ASSERT
      effects.passFinalisationViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
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
      actions$.next(passFinalisationActions.PassFinalisationValidationError('error is blank'));
      // ASSERT
      effects.validationErrorEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type);
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
      // ACT
      actions$.next(passFinalisationActions.PassFinalisationValidationError('error message'));
      // ASSERT
      effects.validationErrorEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
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
  describe('code78PresentEffect', () => {
    it('should call logEvent', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(passCompletionActions.Code78Present());
      // ASSERT
      effects.code78PresentEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.CODE78,
            GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
            GoogleAnalyticsEventsValues.AUTOMATIC,
          );
        done();
      });
    });
  });
  describe('code78NotPresentEffect', () => {
    it('should call logEvent', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(passCompletionActions.Code78NotPresent());
      // ASSERT
      effects.code78NotPresentEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.CODE78,
            GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
            GoogleAnalyticsEventsValues.MANUAL,
          );
        done();
      });
    });
  });
  describe('provisionalLicenseNotReceived', () => {
    it('should call logEvent', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(passCompletionActions.ProvisionalLicenseNotReceived());
      // ASSERT
      effects.provisionalLicenseNotReceived$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.LICENCE_RECEIVED,
            GoogleAnalyticsEventsTitles.RECEIVED,
            GoogleAnalyticsEventsValues.NO,
          );
        done();
      });
    });
    it('should call logEvent with practice mode prefix', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(passCompletionActions.ProvisionalLicenseNotReceived());
      // ASSERT
      effects.provisionalLicenseNotReceived$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LICENCE_RECEIVED}`,
            GoogleAnalyticsEventsTitles.RECEIVED,
            GoogleAnalyticsEventsValues.NO,
          );
        done();
      });
    });
  });
  describe('provisionalLicenseReceived', () => {
    it('should call logEvent', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(passCompletionActions.ProvisionalLicenseReceived());
      // ASSERT
      effects.provisionalLicenseReceived$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.LICENCE_RECEIVED,
            GoogleAnalyticsEventsTitles.RECEIVED,
            GoogleAnalyticsEventsValues.YES,
          );
        done();
      });
    });
    it('should call logEvent with practice mode prefix', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(passCompletionActions.ProvisionalLicenseReceived());
      // ASSERT
      effects.provisionalLicenseReceived$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LICENCE_RECEIVED}`,
            GoogleAnalyticsEventsTitles.RECEIVED,
            GoogleAnalyticsEventsValues.YES,
          );
        done();
      });
    });
  });
  describe('transmissionChanged$', () => {
    it('should call logEvent with Manual if Gearbox Category is Manual', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(ActivityCodes.PASS));
      // ACT
      actions$.next(vehicleDetailsActions.GearboxCategoryChanged(TransmissionType.Manual));
      // ASSERT
      effects.transmissionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.SET_TRANSMISSION,
            GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
            GoogleAnalyticsEventsValues.MANUAL,
          );
        done();
      });
    });
    it('should call logEvent with Manual if Gearbox Category is Manual with practice mode prefix', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(SetActivityCode(ActivityCodes.PASS));
      // ACT
      actions$.next(vehicleDetailsActions.GearboxCategoryChanged(TransmissionType.Manual));
      // ASSERT
      effects.transmissionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SET_TRANSMISSION}`,
            GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
            GoogleAnalyticsEventsValues.MANUAL,
          );
        done();
      });
    });
    it('should call logEvent with Automatic if Gearbox Category is Automatic', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(ActivityCodes.PASS));
      // ACT
      actions$.next(vehicleDetailsActions.GearboxCategoryChanged(TransmissionType.Automatic));
      // ASSERT
      effects.transmissionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.SET_TRANSMISSION,
            GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
            GoogleAnalyticsEventsValues.AUTOMATIC,
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
      actions$.next(vehicleDetailsActions.GearboxCategoryChanged(TransmissionType.Manual));
      // ASSERT
      effects.transmissionChanged$.subscribe((result) => {
        expect(result.type === AnalyticNotRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .not
          .toHaveBeenCalled();
        done();
      });
    });
  });
  describe('d255Yes', () => {
    it('should call logEvent', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode('1'));
      // ACT
      actions$.next(testSummaryActions.D255Yes());
      // ASSERT
      effects.d255Yes$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
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
    it('should call logEvent with the practice mode prefix', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(SetActivityCode('1'));
      // ACT
      actions$.next(testSummaryActions.D255Yes());
      // ASSERT
      effects.d255Yes$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SET_D255}`,
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
      store$.dispatch(SetActivityCode('1'));
      // ACT
      actions$.next(testSummaryActions.D255No());
      // ASSERT
      effects.d255No$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
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
    it('should call logEvent with the practice mode prefix', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(SetActivityCode('1'));
      // ACT
      actions$.next(testSummaryActions.D255No());
      // ASSERT
      effects.d255No$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SET_D255}`,
            GoogleAnalyticsEventsTitles.FINALISATION_D255,
            GoogleAnalyticsEventsValues.NO,
          );
        done();
      });
    });
  });
  describe('candidateChoseToProceedWithTestInEnglish$', () => {
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
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .not
          .toHaveBeenCalled();
        done();
      });
    });
  });
  describe('candidateChoseToProceedWithTestInWelsh$', () => {
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
    it('should not call logEvent if there is no activity code', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(null));
      // ACT
      actions$.next(commsActions.CandidateChoseToProceedWithTestInWelsh(Language.CYMRAEG));
      // ASSERT
      effects.candidateChoseToProceedWithTestInWelsh$.subscribe((result) => {
        expect(result.type === AnalyticNotRecorded.type)
          .toBe(true);
        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .not
          .toHaveBeenCalled();
        done();
      });
    });
  });
});

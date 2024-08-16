import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { StoreModel } from '@shared/models/store.model';
import { Application } from '@dvsa/mes-journal-schema';
import { testsReducer } from '@store/tests/tests.reducer';
import * as testsActions from '@store/tests/tests.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import * as applicationReferenceActions
  from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import {
  AnalyticsScreenNames, GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import {
  VRNModalCancelled,
  VRNModalOpened,
  VRNModalSaved,
} from '@store/tests/candidate-section/candidate-section.actions';
import { Router } from '@angular/router';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as communicationActions from '../communication.actions';
import { CommunicationAnalyticsEffects } from '../communication.analytics.effects';

describe('CommunicationAnalyticsEffects', () => {
  let effects: CommunicationAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.COMMUNICATION;
  const screenNamePM = `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${AnalyticsScreenNames.COMMUNICATION}`;
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
        CommunicationAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: Router,
          useValue: { url: `/${TestFlowPageNames.COMMUNICATION_PAGE}` },
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
    effects = TestBed.inject(CommunicationAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  }));

  describe('communicationViewDidEnter', () => {
    it('should call setCurrentPage and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(communicationActions.CommunicationViewDidEnter());
      // ASSERT
      effects.communicationViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(screenName);
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.TEST_CATEGORY, 'B');
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE, '123456789');
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
      actions$.next(communicationActions.CommunicationViewDidEnter());
      // ASSERT
      effects.communicationViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(screenNamePM);
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.TEST_CATEGORY, 'B');
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE, '123456789');
        done();
      });
    });
  });

  describe('communicationValidationError', () => {
    it('should call logError', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(communicationActions.CommunicationValidationError('formControl1'));
      // ASSERT
      effects.communicationValidationError$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.VALIDATION_ERROR,
            GoogleAnalyticsEventsTitles.BLANK_FIELD,
            'formControl1');
        done();
      });
    });
    it('should call logError, prefixed with practice mode', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(communicationActions.CommunicationValidationError('formControl1'));
      // ASSERT
      effects.communicationValidationError$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            `PM_${GoogleAnalyticsEvents.VALIDATION_ERROR}`,
            GoogleAnalyticsEventsTitles.BLANK_FIELD,
            'formControl1');
        done();
      });
    });
  });

  describe('VrnModalOpened$', () => {
    it('should dispatch action when opening modal', () => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      // ACT
      actions$.next(VRNModalOpened());
      // ASSERT
      effects.vrnModalOpened$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toBe(AnalyticRecorded.type);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.VRN_CAPTURE,
            GoogleAnalyticsEventsTitles.OUTCOME,
            GoogleAnalyticsEventsValues.VRN_CAPTURE_SELECTED,
          );
      });
    });
  });

  describe('VrnModalCancelled$', () => {
    it('should dispatch action when cancel button on modal clicked', () => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      // ACT
      actions$.next(VRNModalCancelled());
      // ASSERT
      effects.vrnModalCancelled$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toBe(AnalyticRecorded.type);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.VRN_CAPTURE,
            GoogleAnalyticsEventsTitles.OUTCOME,
            GoogleAnalyticsEventsValues.VRN_CAPTURE_CANCELLED,
          );
      });
    });
  });

  describe('VrnModalSaved$', () => {
    it('should dispatch action when save button on modal clicked', () => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      // ACT
      actions$.next(VRNModalSaved());
      // ASSERT
      effects.vrnModalSaved$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toBe(AnalyticRecorded.type);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.VRN_CAPTURE,
            GoogleAnalyticsEventsTitles.OUTCOME,
            GoogleAnalyticsEventsValues.VRN_CAPTURE_SAVED,
          );
      });
    });
  });

  describe('bookingEmailSelected$', () => {
    it('should dispatch action when booking email option is selected', (done) => {
      actions$.next(communicationActions.BookingEmailSelected());
      effects.bookingEmailSelected$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS,
            GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
            GoogleAnalyticsEventsValues.COMMS_METHOD_BOOKING_EMAIL,
          );
        done();
      });
    });
  });

  describe('newEmailSelected$', () => {
    it('should dispatch action when new email option is selected', (done) => {
      actions$.next(communicationActions.NewEmailSelected());
      effects.newEmailSelected$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS,
            GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
            GoogleAnalyticsEventsValues.COMMS_METHOD_NEW_EMAIL,
          );
        done();
      });
    });
  });

  describe('postalSelected$', () => {
    it('should dispatch action when postal option is selected', (done) => {
      actions$.next(communicationActions.PostalSelected());
      effects.postalSelected$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS,
            GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
            GoogleAnalyticsEventsValues.COMMS_METHOD_POST,
          );
        done();
      });
    });
  });

});

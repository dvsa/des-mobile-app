import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Application } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { StoreModel } from '@shared/models/store.model';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import {
  VRNModalCancelled,
  VRNModalOpened,
  VRNModalSaved,
} from '@store/tests/candidate-section/candidate-section.actions';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import * as applicationReferenceActions from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as communicationActions from '../communication.actions';
import { CommunicationAnalyticsEffects } from '../communication.analytics.effects';

describe('CommunicationAnalyticsEffects', () => {
  let effects: CommunicationAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.COMMUNICATION;
  const screenNamePM = `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${AnalyticsScreenNames.COMMUNICATION}`;
  const mockApplication: Application = {
    applicationId: 123456,
    bookingSequence: 78,
    checkDigit: 9,
  };

  beforeEach(() => {
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
  });

  describe('communicationViewDidEnter', () => {
    it('should call setCurrentPage and addCustomDimension', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(communicationActions.CommunicationViewDidEnter());
      const result = await firstValueFrom(effects.communicationViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.TEST_CATEGORY,
        'B'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
    });
    it('should call setCurrentPage with practice mode prefix and addCustomDimension', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(communicationActions.CommunicationViewDidEnter());
      const result = await firstValueFrom(effects.communicationViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenNamePM);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.TEST_CATEGORY,
        'B'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
    });
  });

  describe('communicationValidationError', () => {
    it('should call logError', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(communicationActions.CommunicationValidationError('formControl1'));
      const result = await firstValueFrom(effects.communicationValidationError$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.VALIDATION_ERROR,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'formControl1'
      );
    });
    it('should call logError, prefixed with practice mode', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(communicationActions.CommunicationValidationError('formControl1'));
      const result = await firstValueFrom(effects.communicationValidationError$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `PM_${GoogleAnalyticsEvents.VALIDATION_ERROR}`,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'formControl1'
      );
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
        expect(result.type).toBe(AnalyticRecorded.type);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.VRN_CAPTURE,
          GoogleAnalyticsEventsTitles.OUTCOME,
          GoogleAnalyticsEventsValues.VRN_CAPTURE_SELECTED
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
        expect(result.type).toBe(AnalyticRecorded.type);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.VRN_CAPTURE,
          GoogleAnalyticsEventsTitles.OUTCOME,
          GoogleAnalyticsEventsValues.VRN_CAPTURE_CANCELLED
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
        expect(result.type).toBe(AnalyticRecorded.type);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.VRN_CAPTURE,
          GoogleAnalyticsEventsTitles.OUTCOME,
          GoogleAnalyticsEventsValues.VRN_CAPTURE_SAVED
        );
      });
    });
  });

  describe('bookingEmailSelected$', () => {
    it('should dispatch action when booking email option is selected', async () => {
      actions$.next(communicationActions.BookingEmailSelected());
      const result = await firstValueFrom(effects.bookingEmailSelected$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS,
        GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
        GoogleAnalyticsEventsValues.COMMS_METHOD_BOOKING_EMAIL
      );
    });
  });

  describe('newEmailSelected$', () => {
    it('should dispatch action when new email option is selected', async () => {
      actions$.next(communicationActions.NewEmailSelected());
      const result = await firstValueFrom(effects.newEmailSelected$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS,
        GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
        GoogleAnalyticsEventsValues.COMMS_METHOD_NEW_EMAIL
      );
    });
  });

  describe('postalSelected$', () => {
    it('should dispatch action when postal option is selected', async () => {
      actions$.next(communicationActions.PostalSelected());
      const result = await firstValueFrom(effects.postalSelected$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS,
        GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
        GoogleAnalyticsEventsValues.COMMS_METHOD_POST
      );
    });
  });
});

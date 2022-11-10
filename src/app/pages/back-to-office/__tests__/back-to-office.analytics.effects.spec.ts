import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsScreenNames,
  AnalyticsEventCategories,
  AnalyticsDimensionIndices,
  AnalyticsEvents,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { StoreModel } from '@shared/models/store.model';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store//tests/tests.reducer';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { Application } from '@dvsa/mes-journal-schema';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { ActivityCodes } from '@shared/models/activity-codes';
import * as applicationReferenceActions
  from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import * as activityCodeActions from '@store//tests/activity-code/activity-code.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { BackToOfficeAnalyticsEffects } from '../back-to-office.analytics.effects';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as backToOfficeActions from '../back-to-office.actions';

describe('BackToOfficeAnalyticsEffects', () => {
  let effects: BackToOfficeAnalyticsEffects;
  let analyticsProviderMock;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.BACK_TO_OFFICE;
  const screenNamePracticeMode = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.BACK_TO_OFFICE}`;
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
        BackToOfficeAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(BackToOfficeAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
    spyOn(analyticsProviderMock, 'logEvent');
  }));

  describe('backToOfficeViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(backToOfficeActions.BackToOfficeViewDidEnter());
      // ASSERT
      effects.backToOfficeViewDidEnter$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenName);
        done();
      });
    });
    it('should call setCurrentPage with practice mode prefix', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(backToOfficeActions.BackToOfficeViewDidEnter());
      // ASSERT
      effects.backToOfficeViewDidEnter$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenNamePracticeMode);
        done();
      });
    });

  });

  describe('deferWriteUpEffect', () => {
    it('should call logEvent with pass page and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(backToOfficeActions.DeferWriteUp());
      // ASSERT
      effects.deferWriteUpEffect$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.BACK_TO_OFFICE,
            AnalyticsEvents.DEFER_WRITE_UP,
            'pass',
          );
        done();
      });
    });
    it('should call logEvent with fail page and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(backToOfficeActions.DeferWriteUp());
      // ASSERT
      effects.deferWriteUpEffect$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.BACK_TO_OFFICE,
            AnalyticsEvents.DEFER_WRITE_UP,
            'fail',
          );
        done();
      });
    });
    it('should call logEvent with pass page, practice mode prefix and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(backToOfficeActions.DeferWriteUp());
      // ASSERT
      effects.deferWriteUpEffect$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.BACK_TO_OFFICE}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.DEFER_WRITE_UP}`,
            'pass',
          );
        done();
      });
    });
    it('should call logEvent with fail page, practice mode prefix and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(backToOfficeActions.DeferWriteUp());
      // ASSERT
      effects.deferWriteUpEffect$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.BACK_TO_OFFICE}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.DEFER_WRITE_UP}`,
            'fail',
          );
        done();
      });
    });
  });

});

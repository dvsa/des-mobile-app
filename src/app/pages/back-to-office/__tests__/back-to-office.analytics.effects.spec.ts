import { TestBed, waitForAsync } from '@angular/core/testing';
import { Application } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
	AnalyticsDimensionIndices,
	AnalyticsEventCategories,
	AnalyticsEvents,
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
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import * as activityCodeActions from '@store//tests/activity-code/activity-code.actions';
import { testsReducer } from '@store//tests/tests.reducer';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import * as applicationReferenceActions from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as testsActions from '@store/tests/tests.actions';
import { ReplaySubject } from 'rxjs';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as backToOfficeActions from '../back-to-office.actions';
import { BackToOfficeAnalyticsEffects } from '../back-to-office.analytics.effects';

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

				// TODO - MES-9495 - remove old analytics
				expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);

				// GA4 Analytics
				expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
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

				// TODO - MES-9495 - remove old analytics
				expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenNamePracticeMode);

				// GA4 Analytics
				expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
					`${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenName}`
				);
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

				// TODO - MES-9495 - remove old analytics
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.CANDIDATE_ID,
					'1'
				);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.APPLICATION_REFERENCE,
					'123456789'
				);
				expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
					AnalyticsEventCategories.BACK_TO_OFFICE,
					AnalyticsEvents.DEFER_WRITE_UP,
					'pass'
				);

				// GA4 Analytics
				expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
					GoogleAnalyticsCustomDimension.CANDIDATE_ID,
					'1'
				);
				expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
					GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
					'123456789'
				);
				expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
					GoogleAnalyticsEvents.DEFER_WRITE_UP,
					GoogleAnalyticsEventsTitles.RESULT,
					GoogleAnalyticsEventsValues.PASS
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

				// TODO - MES-9495 - remove old analytics
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.CANDIDATE_ID,
					'1'
				);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.APPLICATION_REFERENCE,
					'123456789'
				);
				expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
					AnalyticsEventCategories.BACK_TO_OFFICE,
					AnalyticsEvents.DEFER_WRITE_UP,
					'fail'
				);

				// GA4 Analytics
				expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
					GoogleAnalyticsCustomDimension.CANDIDATE_ID,
					'1'
				);
				expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
					GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
					'123456789'
				);
				expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
					GoogleAnalyticsEvents.DEFER_WRITE_UP,
					GoogleAnalyticsEventsTitles.RESULT,
					GoogleAnalyticsEventsValues.FAIL
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

				// TODO - MES-9495 - remove old analytics
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.CANDIDATE_ID,
					'1'
				);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.APPLICATION_REFERENCE,
					'123456789'
				);
				expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
					`${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.BACK_TO_OFFICE}`,
					`${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.DEFER_WRITE_UP}`,
					'pass'
				);

				// GA4 Analytics
				expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
					GoogleAnalyticsCustomDimension.CANDIDATE_ID,
					'1'
				);
				expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
					GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
					'123456789'
				);
				expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
					`${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.DEFER_WRITE_UP}`,
					GoogleAnalyticsEventsTitles.RESULT,
					GoogleAnalyticsEventsValues.PASS
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

				// TODO - MES-9495 - remove old analytics
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.CANDIDATE_ID,
					'1'
				);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.APPLICATION_REFERENCE,
					'123456789'
				);
				expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
					`${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.BACK_TO_OFFICE}`,
					`${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.DEFER_WRITE_UP}`,
					'fail'
				);

				// GA4 Analytics
				expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
					GoogleAnalyticsCustomDimension.CANDIDATE_ID,
					'1'
				);
				expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
					GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
					'123456789'
				);
				expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
					`${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.DEFER_WRITE_UP}`,
					GoogleAnalyticsEventsTitles.RESULT,
					GoogleAnalyticsEventsValues.FAIL
				);
				done();
			});
		});
	});
});

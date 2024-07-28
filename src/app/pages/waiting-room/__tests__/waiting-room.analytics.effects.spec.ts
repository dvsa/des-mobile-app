import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Application } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
	AnalyticsDimensionIndices,
	AnalyticsErrorTypes,
	AnalyticsEventCategories,
	AnalyticsEvents,
	AnalyticsScreenNames,
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
import { ReplaySubject } from 'rxjs';
import * as waitingRoomActions from '../waiting-room.actions';
import { WaitingRoomAnalyticsEffects } from '../waiting-room.analytics.effects';

describe('WaitingRoomAnalyticsEffects', () => {
	let effects: WaitingRoomAnalyticsEffects;
	let analyticsProviderMock;
	let actions$: ReplaySubject<any>;
	let store$: Store<StoreModel>;
	const screenName = AnalyticsScreenNames.WAITING_ROOM;
	const screenNamePracticeMode = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.WAITING_ROOM}`;
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
				WaitingRoomAnalyticsEffects,
				{
					provide: AnalyticsProvider,
					useClass: AnalyticsProviderMock,
				},
				{
					provide: Router,
					useValue: { url: `/${TestFlowPageNames.WAITING_ROOM_PAGE}` },
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
		effects = TestBed.inject(WaitingRoomAnalyticsEffects);
		analyticsProviderMock = TestBed.inject(AnalyticsProvider);
		store$ = TestBed.inject(Store);
		spyOn(analyticsProviderMock, 'logEvent');
	});

	describe('waitingRoomViewDidEnter', () => {
		it('should call setCurrentPage and addCustomDimension', (done) => {
			// ARRANGE
			store$.dispatch(testsActions.StartTest(123, TestCategory.B));
			store$.dispatch(PopulateCandidateDetails(candidateMock));
			store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
			store$.dispatch(PopulateTestCategory(TestCategory.B));
			// ACT
			actions$.next(waitingRoomActions.WaitingRoomViewDidEnter());
			// ASSERT
			effects.waitingRoomViewDidEnter$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
				expect(result.type).toEqual(AnalyticRecorded.type);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.TEST_CATEGORY,
					'B'
				);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.CANDIDATE_ID,
					'1'
				);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.APPLICATION_REFERENCE,
					'123456789'
				);
				expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);
				done();
			});
		});
		it('should call setCurrentPage with practice mode prefix and addCustomDimension', (done) => {
			// ARRANGE
			store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
			store$.dispatch(PopulateCandidateDetails(candidateMock));
			store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
			store$.dispatch(PopulateTestCategory(TestCategory.B));
			// ACT
			actions$.next(waitingRoomActions.WaitingRoomViewDidEnter());
			// ASSERT
			effects.waitingRoomViewDidEnter$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
				expect(result.type).toEqual(AnalyticRecorded.type);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.TEST_CATEGORY,
					'B'
				);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.CANDIDATE_ID,
					'1'
				);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.APPLICATION_REFERENCE,
					'123456789'
				);
				expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenNamePracticeMode);
				done();
			});
		});
	});

	describe('waitingRoomValidationError', () => {
		it('should call logError', (done) => {
			// ARRANGE
			store$.dispatch(testsActions.StartTest(123, TestCategory.B));
			store$.dispatch(PopulateCandidateDetails(candidateMock));
			store$.dispatch(PopulateTestCategory(TestCategory.B));
			// ACT
			actions$.next(waitingRoomActions.WaitingRoomValidationError('formControl1'));
			// ASSERT
			effects.waitingRoomValidationError$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
				expect(result.type).toEqual(AnalyticRecorded.type);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.TEST_CATEGORY,
					'B'
				);
				expect(analyticsProviderMock.logError).toHaveBeenCalledWith(
					`${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenName})`,
					'formControl1'
				);
				done();
			});
		});
		it('should call logError, prefixed with practice mode', (done) => {
			// ARRANGE
			store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
			store$.dispatch(PopulateCandidateDetails(candidateMock));
			store$.dispatch(PopulateTestCategory(TestCategory.B));
			// ACT
			actions$.next(waitingRoomActions.WaitingRoomValidationError('formControl1'));
			// ASSERT
			effects.waitingRoomValidationError$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
				expect(result.type).toBe(AnalyticRecorded.type);
				expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
					AnalyticsDimensionIndices.TEST_CATEGORY,
					'B'
				);
				expect(analyticsProviderMock.logError).toHaveBeenCalledWith(
					`${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenNamePracticeMode})`,
					'formControl1'
				);
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
				expect(result.type).toBe(AnalyticRecorded.type);
				expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
					AnalyticsEventCategories.WAITING_ROOM,
					AnalyticsEvents.VRN_CAPTURE,
					AnalyticsEvents.VRN_CAPTURE_SELECTED
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
				expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
					AnalyticsEventCategories.WAITING_ROOM,
					AnalyticsEvents.VRN_CAPTURE,
					AnalyticsEvents.VRN_CAPTURE_CANCELLED
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
				expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
					AnalyticsEventCategories.WAITING_ROOM,
					AnalyticsEvents.VRN_CAPTURE,
					AnalyticsEvents.VRN_CAPTURE_SAVED
				);
			});
		});
	});
});

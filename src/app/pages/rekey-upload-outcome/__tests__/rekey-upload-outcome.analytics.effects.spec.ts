import { TestBed, waitForAsync } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsScreenNames, GoogleAnalyticsEventPrefix } from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { StoreModel } from '@shared/models/store.model';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject } from 'rxjs';
import * as rekeyUploadedActions from '../rekey-upload-outcome.actions';
import { RekeyUploadOutcomeAnalyticsEffects } from '../rekey-upload-outcome.analytics.effects';

describe('RekeyUploadOutcomeAnalyticsEffects', () => {
	let effects: RekeyUploadOutcomeAnalyticsEffects;
	let analyticsProviderMock: AnalyticsProvider;
	let actions$: ReplaySubject<any>;
	let store$: Store<StoreModel>;
	const screenName = AnalyticsScreenNames.REKEY_UPLOADED;

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
				expect(result.type === AnalyticRecorded.type).toBe(true);

				// TODO - MES-9495 - remove old analytics
				expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);

				// GA4 analytics
				expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(AnalyticsScreenNames.REKEY_UPLOADED);
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
				expect(result.type === AnalyticRecorded.type).toBe(true);

				// GA4 analytics
				expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
					`${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${AnalyticsScreenNames.REKEY_UPLOADED}`
				);
				done();
			});
		});
	});
});

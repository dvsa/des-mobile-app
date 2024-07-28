import { TestBed, waitForAsync } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
	AnalyticsEventCategories,
	AnalyticsScreenNames,
	GoogleAnalyticsEventPrefix,
} from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import * as activityCodeActions from '@store/tests/activity-code/activity-code.actions';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject } from 'rxjs';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as debriefActions from '../debrief.actions';
import { DebriefAnalyticsEffects } from '../debrief.analytics.effects';

describe('DebriefAnalyticsEffects', () => {
	let effects: DebriefAnalyticsEffects;
	let analyticsProviderMock;
	let actions$: ReplaySubject<any>;
	let store$: Store<StoreModel>;
	const screenNamePass = AnalyticsScreenNames.PASS_DEBRIEF;
	const screenNameFail = AnalyticsScreenNames.FAIL_DEBRIEF;
	const screenNamePracticeModePass = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.PASS_DEBRIEF}`;
	const screenNamePracticeModeFail = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.FAIL_DEBRIEF}`;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				StoreModule.forRoot({
					tests: testsReducer,
				}),
			],
			providers: [
				DebriefAnalyticsEffects,
				{
					provide: AnalyticsProvider,
					useClass: AnalyticsProviderMock,
				},
				provideMockActions(() => actions$),
				{
					provide: AppConfigProvider,
					useClass: AppConfigProviderMock,
				},
				Store,
			],
		});

		actions$ = new ReplaySubject(1);
		effects = TestBed.inject(DebriefAnalyticsEffects);
		analyticsProviderMock = TestBed.inject(AnalyticsProvider);
		store$ = TestBed.inject(Store);
	}));

	describe('debriefViewDidEnter', () => {
		it('should call setCurrentPage with pass page', (done) => {
			// ARRANGE
			store$.dispatch(testsActions.StartTest(123, TestCategory.B));
			store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
			// ACT
			actions$.next(debriefActions.DebriefViewDidEnter());
			// ASSERT
			effects.debriefViewDidEnter$.subscribe((result) => {
				expect(result.type).toEqual(AnalyticRecorded.type);
				// TODO - MES-9495 - remove old analytics
				expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenNamePass);
				// GA4 Analytics
				expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenNamePass);
				done();
			});
		});
		it('should call setCurrentPage with fail page', (done) => {
			// ARRANGE
			store$.dispatch(testsActions.StartTest(123, TestCategory.B));
			store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
			// ACT
			actions$.next(debriefActions.DebriefViewDidEnter());
			// ASSERT
			effects.debriefViewDidEnter$.subscribe((result) => {
				expect(result.type).toEqual(AnalyticRecorded.type);
				// TODO - MES-9495 - remove old analytics
				expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenNameFail);
				// GA4 Analytics
				expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenNameFail);
				done();
			});
		});
		it('should call setCurrentPage with pass and practice mode prefix', (done) => {
			// ARRANGE
			store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
			store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
			// ACT
			actions$.next(debriefActions.DebriefViewDidEnter());
			// ASSERT
			effects.debriefViewDidEnter$.subscribe((result) => {
				expect(result.type).toEqual(AnalyticRecorded.type);
				// TODO - MES-9495 - remove old analytics
				expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenNamePracticeModePass);
				// GA4 Analytics
				expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
					`${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenNamePass}`
				);
				done();
			});
		});
		it('should call setCurrentPage with fail and practice mode prefix', (done) => {
			// ARRANGE
			store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
			store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
			// ACT
			actions$.next(debriefActions.DebriefViewDidEnter());
			// ASSERT
			effects.debriefViewDidEnter$.subscribe((result) => {
				expect(result.type).toEqual(AnalyticRecorded.type);
				// TODO - MES-9495 - remove old analytics
				expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenNamePracticeModeFail);
				// GA4 Analytics
				expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
					`${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenNameFail}`
				);
				done();
			});
		});
	});
});

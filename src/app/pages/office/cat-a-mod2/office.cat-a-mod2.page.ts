import { Component, Injector } from '@angular/core';
import { ModeOfTransport } from '@dvsa/mes-test-schema/categories/AM2';
import { SafetyQuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { select } from '@ngrx/store';
import {
	CommonOfficePageState,
	OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { activityCodeModelList } from '@shared/constants/activity-code/activity-code.constants';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { AddSafetyAndBalanceComment } from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import { safetyAndBalanceQuestionsExist } from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.selector';
import { getTestData } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import { getSafetyAndBalanceQuestions } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.selector';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { EyesightTestAddComment } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { ModeOfTransportChanged } from '@store/tests/test-summary/cat-a-mod2/test-summary.cat-a-mod2.actions';
import { getTestSummary } from '@store/tests/test-summary/cat-a-mod2/test-summary.cat-a-mod2.reducer';
import { getModeOfTransport } from '@store/tests/test-summary/cat-a-mod2/test-summary.cat-a-mod2.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getTestOutcome } from '@store/tests/tests.selector';
import { getSchoolBike } from '@store/tests/vehicle-details/cat-a-mod1/vehicle-details.cat-a-mod1.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { Observable, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { behaviourMap } from '../office-behaviour-map.cat-a-mod2';
import { OfficeViewDidEnter } from '../office.actions';

interface CatAMod2OfficePageState {
	schoolBike$: Observable<boolean>;
	testCategory$: Observable<TestCategory>;
	displayModeOfTransport$: Observable<boolean>;
	modeOfTransport$: Observable<ModeOfTransport>;
	displayDrivingFaultComments$: Observable<boolean>;
	safetyAndBalanceQuestions$: Observable<SafetyQuestionResult[]>;
	displaySafetyAndBalance$: Observable<boolean>;
}

type OfficePageState = CommonOfficePageState & CatAMod2OfficePageState;

@Component({
	selector: '.office-cat-a-mod2-page',
	templateUrl: 'office.cat-a-mod2.page.html',
	styleUrls: ['../office.page.scss'],
})
export class OfficeCatAMod2Page extends OfficeBasePageComponent {
	pageState: OfficePageState;
	pageSubscription: Subscription;
	static readonly maxFaultCount = 10;

	constructor(injector: Injector) {
		super(injector);
		this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
		this.activityCodeOptions = activityCodeModelList;
	}

	ionViewDidEnter(): void {
		this.store$.dispatch(OfficeViewDidEnter());
	}

	ngOnInit(): void {
		super.onInitialisation();

		const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));
		const testCategory$ = currentTest$.pipe(
			select(getTestCategory),
			map((testCategory) => testCategory as TestCategory)
		);

		this.pageState = {
			...this.commonPageState,
			schoolBike$: currentTest$.pipe(select(getVehicleDetails), select(getSchoolBike)),
			testCategory$,
			displayModeOfTransport$: currentTest$.pipe(
				select(getTestOutcome),
				withLatestFrom(currentTest$.pipe(select(getTestSummary), select(getModeOfTransport))),
				map(([outcome, modeOfTransport]) =>
					this.outcomeBehaviourProvider.isVisible(outcome, 'modeOfTransport', modeOfTransport)
				)
			),
			displaySafetyAndBalance$: currentTest$.pipe(
				select(getTestOutcome),
				withLatestFrom(currentTest$.pipe(select(getTestData))),
				map(([outcome, data]) =>
					this.outcomeBehaviourProvider.isVisible(
						outcome,
						'safetyAndBalance',
						safetyAndBalanceQuestionsExist(data.safetyAndBalanceQuestions)
					)
				)
			),
			modeOfTransport$: currentTest$.pipe(select(getTestSummary), select(getModeOfTransport)),
			displayDrivingFaultComments$: currentTest$.pipe(
				select(getTestData),
				withLatestFrom(testCategory$),
				map(([data, category]) =>
					this.faultCountProvider.shouldDisplayDrivingFaultComments(data, category, OfficeCatAMod2Page.maxFaultCount)
				)
			),
			safetyAndBalanceQuestions$: currentTest$.pipe(
				select(getTestData),
				select(getSafetyAndBalanceQuestions),
				map((checks) => [...checks.safetyQuestions, ...checks.balanceQuestions])
			),
		};

		this.setupSubscriptions();
	}

	async ionViewWillEnter() {
		super.ionViewWillEnter();

		if (!this.isPracticeMode && super.isIos()) {
			await this.deviceProvider.disableSingleAppMode();
		}
	}

	modeOfTransportChanged(modeOfTransport: ModeOfTransport): void {
		this.store$.dispatch(ModeOfTransportChanged(modeOfTransport));
	}

	dangerousFaultCommentChanged(dangerousFaultComment: FaultSummary) {
		// CatAMod2 dangerous faults can only be of type "SIMPLE"
		this.store$.dispatch(
			AddDangerousFaultComment(dangerousFaultComment.competencyIdentifier, dangerousFaultComment.comment)
		);
	}

	seriousFaultCommentChanged(seriousFaultComment: FaultSummary) {
		if (seriousFaultComment.source === CommentSource.SIMPLE) {
			this.store$.dispatch(
				AddSeriousFaultComment(seriousFaultComment.competencyIdentifier, seriousFaultComment.comment)
			);
		} else if (seriousFaultComment.source === CommentSource.EYESIGHT_TEST) {
			this.store$.dispatch(EyesightTestAddComment(seriousFaultComment.comment));
		}
	}

	drivingFaultCommentChanged(drivingFaultComment: FaultSummary) {
		if (drivingFaultComment.source === CommentSource.SIMPLE) {
			this.store$.dispatch(
				AddDrivingFaultComment(drivingFaultComment.competencyIdentifier, drivingFaultComment.comment)
			);
		} else if (drivingFaultComment.source === CommentSource.SAFETY_AND_BALANCE_QUESTIONS) {
			this.store$.dispatch(AddSafetyAndBalanceComment(drivingFaultComment.comment));
		}
	}
}

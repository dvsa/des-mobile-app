import { Component, Injector, OnInit } from '@angular/core';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { select } from '@ngrx/store';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-adi-part2';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import {
	CommonOfficePageState,
	OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { AddManoeuvreComment } from '@store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres.actions';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
import {
	AddShowMeTellMeComment,
	ShowMeQuestionSelected,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.action';
import {
	getSelectedShowMeQuestions,
	getVehicleChecksCatADI2,
	getVehicleChecksDangerous,
	getVehicleChecksSerious,
	vehicleChecksExist,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.selector';
import { AddControlledStopComment } from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import {
	AddEcoCaptureReason,
	AddEcoRelatedFault,
	ToggleFuelEfficientDriving,
} from '@store/tests/test-data/common/eco/eco.actions';
import { EyesightTestAddComment } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import {
	getEco,
	getEcoCaptureReason,
	getEcoRelatedFault,
	getFuelEfficientDriving,
} from '@store/tests/test-data/common/test-data.selector';
import { AddUncoupleRecoupleComment } from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getTestOutcome, getTestOutcomeText } from '@store/tests/tests.selector';
import { startsWith } from 'lodash-es';
import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

interface CatADI2OfficePageState {
	displayDrivingFaultComments$: Observable<boolean>;
	displayTellMeQuestions$: Observable<boolean>;
	showMeQuestions$: Observable<QuestionResult[]>;
	vehicleChecks$: Observable<QuestionResult[]>;
	vehicleChecksSerious$: Observable<boolean>;
	vehicleChecksDangerous$: Observable<boolean>;
	showMeQuestionsFaults$: Observable<number>;
	adi2DrivingFaults$: Observable<FaultSummary[]>;
	fuelEfficientDriving$: Observable<boolean>;
	ecoRelatedFault$: Observable<string>;
	ecoCaptureReason$: Observable<string>;
	displayFuelEfficient$: Observable<boolean>;
	allowDrivingFaultComment$: Observable<boolean>;
}

type OfficePageState = CommonOfficePageState & CatADI2OfficePageState;

@Component({
	selector: 'app-office-cat-adi-part2',
	templateUrl: './office.cat-adi-part2.page.html',
	styleUrls: ['../../office/office.page.scss'],
})
export class OfficeCatADI2Page extends OfficeBasePageComponent implements OnInit {
	pageState: OfficePageState;
	static readonly maxFaultCount = 6;
	showMeQuestions: VehicleChecksQuestion[];

	constructor(
		private appConfig: AppConfigProvider,
		private questionProvider: QuestionProvider,
		injector: Injector
	) {
		super(injector);
		this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
		this.activityCodeOptions = getActivityCodeOptions(this.appConfig.getAppConfig()?.role === ExaminerRole.DLG);
		this.showMeQuestions = this.questionProvider.getShowMeQuestions(TestCategory.ADI2);
	}

	ngOnInit(): void {
		super.onInitialisation();

		const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

		const testCategory$ = currentTest$.pipe(select(getTestCategory));

		this.pageState = {
			...this.commonPageState,
			displayDrivingFaultComments$: currentTest$.pipe(
				select(getTestData),
				withLatestFrom(currentTest$.pipe(select(getTestOutcomeText))),
				map(([testData, testOutcomeText]) =>
					this.faultCountProvider.shouldDisplayDrivingFaultComments(testData, TestCategory.ADI2, 0, testOutcomeText)
				)
			),
			displayTellMeQuestions$: currentTest$.pipe(
				select(getTestOutcome),
				withLatestFrom(currentTest$.pipe(select(getTestData))),
				map(([outcome, data]) =>
					this.outcomeBehaviourProvider.isVisible(outcome, 'tellMeQuestion', vehicleChecksExist(data.vehicleChecks))
				)
			),
			vehicleChecks$: currentTest$.pipe(
				select(getTestData),
				select(getVehicleChecksCatADI2),
				map((checks) => [...checks.tellMeQuestions])
			),
			showMeQuestions$: currentTest$.pipe(
				select(getTestData),
				select(getVehicleChecksCatADI2),
				select(getSelectedShowMeQuestions)
			),
			vehicleChecksSerious$: currentTest$.pipe(
				select(getTestData),
				select(getVehicleChecksCatADI2),
				select(getVehicleChecksSerious)
			),
			vehicleChecksDangerous$: currentTest$.pipe(
				select(getTestData),
				select(getVehicleChecksCatADI2),
				select(getVehicleChecksDangerous)
			),
			showMeQuestionsFaults$: currentTest$.pipe(
				select(getTestData),
				select(getVehicleChecksCatADI2),
				map((data) => this.faultCountProvider.getShowMeFaultCount(TestCategory.ADI2, data).drivingFaults)
			),
			adi2DrivingFaults$: currentTest$.pipe(
				select(getTestData),
				withLatestFrom(testCategory$),
				map(([data, category]) => this.faultSummaryProvider.getDrivingFaultsList(data, category as TestCategory, false))
			),
			fuelEfficientDriving$: currentTest$.pipe(select(getTestData), select(getEco), select(getFuelEfficientDriving)),
			ecoRelatedFault$: currentTest$.pipe(select(getTestData), select(getEco), select(getEcoRelatedFault)),
			ecoCaptureReason$: currentTest$.pipe(select(getTestData), select(getEco), select(getEcoCaptureReason)),
			displayFuelEfficient$: combineLatest([
				currentTest$.pipe(
					select(getTestData),
					withLatestFrom(testCategory$),
					map(([testData, category]) =>
						this.faultSummaryProvider.getSeriousFaultsList(testData, category as TestCategory)
					)
				),
				currentTest$.pipe(
					select(getTestData),
					withLatestFrom(testCategory$),
					map(([testData, category]) =>
						this.faultSummaryProvider.getDangerousFaultsList(testData, category as TestCategory)
					)
				),
				currentTest$.pipe(
					select(getTestData),
					withLatestFrom(testCategory$),
					map(([data, category]) =>
						this.faultSummaryProvider.getDrivingFaultsList(data, category as TestCategory, false)
					)
				),
			]).pipe(
				map(
					([seriousF, dangerousF, drivingF]) =>
						!!(seriousF?.length === 0 && dangerousF?.length === 0 && drivingF?.length === 0)
				)
			),
			allowDrivingFaultComment$: combineLatest([
				currentTest$.pipe(
					select(getTestData),
					withLatestFrom(testCategory$),
					map(([testData, category]) =>
						this.faultSummaryProvider.getSeriousFaultsList(testData, category as TestCategory)
					)
				),
				currentTest$.pipe(
					select(getTestData),
					withLatestFrom(testCategory$),
					map(([testData, category]) =>
						this.faultSummaryProvider.getDangerousFaultsList(testData, category as TestCategory)
					)
				),
			]).pipe(map(([seriousF, dangerousF]) => !!(seriousF?.length === 0 && dangerousF?.length === 0))),
		};
		this.setupSubscription();
	}

	async ionViewWillEnter() {
		super.ionViewWillEnter();

		if (!this.isPracticeMode && super.isIos()) {
			await this.deviceProvider.disableSingleAppMode();
		}
	}

	setupSubscription() {
		super.setupSubscriptions();
	}

	ionViewDidLeave(): void {
		super.ionViewDidLeave();
	}

	dangerousFaultCommentChanged(dangerousFaultComment: FaultSummary) {
		if (dangerousFaultComment.source === CommentSource.SIMPLE) {
			this.store$.dispatch(
				AddDangerousFaultComment(dangerousFaultComment.competencyIdentifier, dangerousFaultComment.comment)
			);
		} else if (startsWith(dangerousFaultComment.source, CommentSource.MANOEUVRES)) {
			const segments = dangerousFaultComment.source.split('-');
			const index = Number.parseInt(segments[1], 10);
			const fieldName = segments[2];
			const controlOrObservation = segments[3];
			this.store$.dispatch(
				AddManoeuvreComment(fieldName, CompetencyOutcome.D, controlOrObservation, dangerousFaultComment.comment, index)
			);
		} else if (dangerousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
			this.store$.dispatch(AddUncoupleRecoupleComment(dangerousFaultComment.comment));
		} else if (dangerousFaultComment.source === CommentSource.VEHICLE_CHECKS) {
			this.store$.dispatch(AddShowMeTellMeComment(dangerousFaultComment.comment));
		} else if (dangerousFaultComment.source === CommentSource.CONTROLLED_STOP) {
			this.store$.dispatch(AddControlledStopComment(dangerousFaultComment.comment));
		}
	}

	seriousFaultCommentChanged(seriousFaultComment: FaultSummary) {
		if (seriousFaultComment.source === CommentSource.SIMPLE) {
			this.store$.dispatch(
				AddSeriousFaultComment(seriousFaultComment.competencyIdentifier, seriousFaultComment.comment)
			);
		} else if (startsWith(seriousFaultComment.source, CommentSource.MANOEUVRES)) {
			const segments = seriousFaultComment.source.split('-');
			const index = Number.parseInt(segments[1], 10);
			const fieldName = segments[2];
			const controlOrObservation = segments[3];
			this.store$.dispatch(
				AddManoeuvreComment(fieldName, CompetencyOutcome.S, controlOrObservation, seriousFaultComment.comment, index)
			);
		} else if (seriousFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
			this.store$.dispatch(AddUncoupleRecoupleComment(seriousFaultComment.comment));
		} else if (seriousFaultComment.source === CommentSource.VEHICLE_CHECKS) {
			this.store$.dispatch(AddShowMeTellMeComment(seriousFaultComment.comment));
		} else if (seriousFaultComment.source === CommentSource.EYESIGHT_TEST) {
			this.store$.dispatch(EyesightTestAddComment(seriousFaultComment.comment));
		} else if (seriousFaultComment.source === CommentSource.CONTROLLED_STOP) {
			this.store$.dispatch(AddControlledStopComment(seriousFaultComment.comment));
		}
	}

	drivingFaultCommentChanged(drivingFaultComment: FaultSummary) {
		if (drivingFaultComment.source === CommentSource.SIMPLE) {
			this.store$.dispatch(
				AddDrivingFaultComment(drivingFaultComment.competencyIdentifier, drivingFaultComment.comment)
			);
		} else if (startsWith(drivingFaultComment.source, CommentSource.MANOEUVRES)) {
			const segments = drivingFaultComment.source.split('-');
			const index = Number.parseInt(segments[1], 10);
			const fieldName = segments[2];
			const controlOrObservation = segments[3];
			this.store$.dispatch(
				AddManoeuvreComment(fieldName, CompetencyOutcome.DF, controlOrObservation, drivingFaultComment.comment, index)
			);
		} else if (drivingFaultComment.source === CommentSource.UNCOUPLE_RECOUPLE) {
			this.store$.dispatch(AddUncoupleRecoupleComment(drivingFaultComment.comment));
		} else if (drivingFaultComment.source === CommentSource.VEHICLE_CHECKS) {
			this.store$.dispatch(AddShowMeTellMeComment(drivingFaultComment.comment));
		} else if (drivingFaultComment.source === CommentSource.CONTROLLED_STOP) {
			this.store$.dispatch(AddControlledStopComment(drivingFaultComment.comment));
		}
	}

	showMeQuestionsChanged(result: QuestionResult, index: number): void {
		this.store$.dispatch(ShowMeQuestionSelected(result, index));
	}

	ecoFaultChanged(fault: string): void {
		this.store$.dispatch(AddEcoRelatedFault(fault));
	}

	ecoCaptureReasonChanged(ecoCaptureReason: string): void {
		this.store$.dispatch(AddEcoCaptureReason(ecoCaptureReason));
	}

	fedChanged(fuelEfficientDriving: boolean): void {
		this.store$.dispatch(ToggleFuelEfficientDriving(fuelEfficientDriving));
	}
}

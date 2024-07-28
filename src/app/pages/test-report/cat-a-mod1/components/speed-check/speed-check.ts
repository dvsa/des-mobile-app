import { Component, Input } from '@angular/core';
import {
	Avoidance,
	EmergencyStop,
	SpeedRequirementCompetencyOutcome,
	TestData,
} from '@dvsa/mes-test-schema/categories/AM1';
import { Store, select } from '@ngrx/store';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { competencyLabels } from '@shared/constants/competencies/competencies';
import {
	FieldValidators,
	getSpeedCheckValidator,
	nonNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import {
	AddAvoidanceSeriousFault,
	RecordAvoidanceFirstAttempt,
	RecordAvoidanceSecondAttempt,
	RemoveAvoidanceSeriousFault,
} from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.actions';
import { getAvoidance } from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.selector';
import {
	AddEmergencyStopSeriousFault,
	RecordEmergencyStopFirstAttempt,
	RecordEmergencyStopSecondAttempt,
	RemoveEmergencyStopSeriousFault,
} from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.actions';
import { getEmergencyStop } from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.selector';
import { getTestData } from '@store/tests/test-data/cat-a-mod1/test-data.cat-a-mod1.reducer';
import { Competencies, SingleFaultCompetencyNames } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { isEmpty } from 'lodash-es';
import { Subscription, merge } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
	selector: 'speed-check',
	templateUrl: 'speed-check.html',
	styleUrls: ['speed-check.scss'],
})
export class SpeedCheckComponent {
	subscription: Subscription;
	firstAttempt: number;
	secondAttempt: number;
	outcome: SpeedRequirementCompetencyOutcome;

	@Input()
	competency: Competencies;

	@Input()
	pairedCompetency?: SingleFaultCompetencyNames;

	readonly speedCheckValidator: FieldValidators = getSpeedCheckValidator();

	constructor(private store$: Store<StoreModel>) {}

	ngOnInit(): void {
		const speedCheckData$ = this.store$.pipe(
			select(getTests),
			select(getCurrentTest),
			select(getTestData),
			map((testData: TestData): void => {
				let speedCheckData: EmergencyStop | Avoidance;
				if (this.competency === Competencies.speedCheckEmergency) {
					speedCheckData = getEmergencyStop(testData);
				}

				if (this.competency === Competencies.speedCheckAvoidance) {
					speedCheckData = getAvoidance(testData);
				}

				if (isEmpty(speedCheckData)) {
					return;
				}

				this.firstAttempt = speedCheckData.firstAttempt;
				this.secondAttempt = speedCheckData.secondAttempt;
				this.outcome = speedCheckData.outcome;
			})
		);

		this.subscription = merge(speedCheckData$).pipe(takeUntil(trDestroy$)).subscribe();
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	toggleNotMet = (): void => {
		if (this.competency === Competencies.speedCheckEmergency) {
			if (this.outcome === CompetencyOutcome.S) {
				this.store$.dispatch(RemoveEmergencyStopSeriousFault());
			} else {
				this.store$.dispatch(AddEmergencyStopSeriousFault());
			}
		} else if (this.competency === Competencies.speedCheckAvoidance) {
			if (this.outcome === CompetencyOutcome.S) {
				this.store$.dispatch(RemoveAvoidanceSeriousFault());
			} else {
				this.store$.dispatch(AddAvoidanceSeriousFault());
			}
		}
	};

	getLabel = (): string => competencyLabels[this.competency];

	getFirstAttempt = (): number | null => {
		return this.firstAttempt || null;
	};

	getSecondAttempt = (): number | null => {
		return this.secondAttempt || null;
	};

	onFirstAttemptChange = (attemptedSpeed: any): void => {
		const firstAttempt = this.formatSpeedAttempt(attemptedSpeed);

		if (this.competency === Competencies.speedCheckEmergency) {
			this.store$.dispatch(RecordEmergencyStopFirstAttempt(firstAttempt));
		}

		if (this.competency === Competencies.speedCheckAvoidance) {
			this.store$.dispatch(RecordAvoidanceFirstAttempt(firstAttempt));
		}
	};

	onSecondAttemptChange = (attemptedSpeed: any): void => {
		const secondAttempt = this.formatSpeedAttempt(attemptedSpeed);

		if (this.competency === Competencies.speedCheckEmergency) {
			this.store$.dispatch(RecordEmergencyStopSecondAttempt(secondAttempt));
		}

		if (this.competency === Competencies.speedCheckAvoidance) {
			this.store$.dispatch(RecordAvoidanceSecondAttempt(secondAttempt));
		}
	};

	formatSpeedAttempt = (event: any): number | undefined => {
		if (event.target.value === '') return undefined;
		if (typeof event.target.value === 'string' && !this.speedCheckValidator.pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(nonNumericValues, '');
		}
		return Number(event.target.value);
	};

	getNotMet(): boolean {
		return this.outcome === CompetencyOutcome.S;
	}

	firstAttemptValid(): boolean {
		return this.firstAttempt !== null && this.firstAttempt >= 0;
	}
}

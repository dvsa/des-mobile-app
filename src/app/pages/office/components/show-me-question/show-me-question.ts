import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';

@Component({
	selector: 'show-me-question',
	templateUrl: 'show-me-question.html',
	styleUrls: ['show-me-question.scss'],
})
export class ShowMeQuestionComponent implements OnChanges {
	@Input()
	display: boolean;

	@Input()
	outcome: string;

	@Input()
	showMeQuestion: VehicleChecksQuestion;

	@Input()
	showMeQuestionOptions: VehicleChecksQuestion[];

	@Input()
	formGroup: UntypedFormGroup;

	@Output()
	showMeQuestionChange = new EventEmitter<VehicleChecksQuestion>();

	formControl: UntypedFormControl;
	static readonly fieldName: string = 'showMeQuestion';

	constructor(public outcomeBehaviourProvider: OutcomeBehaviourMapProvider) {}

	ngOnChanges(): void {
		if (!this.formControl) {
			this.formControl = new UntypedFormControl([]);
			this.formGroup.addControl(ShowMeQuestionComponent.fieldName, this.formControl);
		}
		const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(
			this.outcome,
			ShowMeQuestionComponent.fieldName
		);

		if (visibilityType === VisibilityType.NotVisible) {
			this.formGroup.get(ShowMeQuestionComponent.fieldName).clearValidators();
		} else {
			this.formGroup.get(ShowMeQuestionComponent.fieldName).setValidators([Validators.required]);
		}
		this.formControl.patchValue(this.showMeQuestion);
	}

	showMeQuestionChanged(showMeQuestion: VehicleChecksQuestion): void {
		if (this.formControl.valid) {
			this.showMeQuestionChange.emit(showMeQuestion);
		}
	}

	get invalid(): boolean {
		return !this.formControl.valid && this.formControl.dirty;
	}
}

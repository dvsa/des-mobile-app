import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
	selector: 'additional-information',
	templateUrl: 'additional-information.html',
})
export class AdditionalInformationComponent implements OnChanges {
	@Input()
	display: boolean;

	@Input()
	outcome: string;

	@Input()
	additionalInformation: string;

	@Input()
	formGroup: UntypedFormGroup;

	@Output()
	additionalInformationChange = new EventEmitter<string>();

	formControl: UntypedFormControl;
	static readonly fieldName: string = 'additionalInformation';

	ngOnChanges(): void {
		if (!this.formControl) {
			this.formControl = new UntypedFormControl(null);
			this.formGroup.addControl(AdditionalInformationComponent.fieldName, this.formControl);
		}
		this.formControl.patchValue(this.additionalInformation);
	}

	additionalInformationChanged(additionalInformation: string): void {
		this.additionalInformationChange.emit(additionalInformation);
	}
}

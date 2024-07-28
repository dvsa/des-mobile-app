import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';

@Component({
	selector: 'transfer',
	templateUrl: 'transfer.html',
})
export class TransferComponent implements OnChanges {
	static readonly checkBoxCtrl: string = 'transferSelected';
	static readonly fieldName: string = 'staffNumber';
	private checkBoxFormControl: UntypedFormControl;
	private formControl: UntypedFormControl;

	@Input()
	selected: boolean;

	@Input()
	staffNumber: number;

	@Input()
	isStaffNumberInvalid: boolean;

	@Input()
	formGroup: UntypedFormGroup;

	@Output()
	selectedChange = new EventEmitter<boolean>();

	@Output()
	staffNumberChange = new EventEmitter<number>();

	constructor(public accessibilityService: AccessibilityService) {}

	ngOnChanges(): void {
		if (!this.checkBoxFormControl) {
			this.checkBoxFormControl = new UntypedFormControl(null);
			this.formGroup.addControl(TransferComponent.checkBoxCtrl, this.checkBoxFormControl);
		}

		if (!this.formControl) {
			this.formControl = new UntypedFormControl(null);
			this.formGroup.addControl(TransferComponent.fieldName, this.formControl);
		}

		if (this.selected) {
			this.formGroup.get(TransferComponent.fieldName).setValidators([Validators.required]);
		} else {
			this.formGroup.get(TransferComponent.fieldName).clearValidators();
		}

		this.checkBoxFormControl.patchValue(!!this.selected);
		this.formControl.patchValue(this.staffNumber);
	}

	selectedValueChanged(selected: boolean): void {
		if (!selected) {
			this.formGroup.get(TransferComponent.fieldName).reset();
		}
		this.selectedChange.emit(selected);
	}

	staffNumberValueChanged(staffNumber: string): void {
		if (!staffNumber || Number.isNaN(staffNumber)) {
			this.formGroup.get(TransferComponent.fieldName).reset();
		}
		this.staffNumberChange.emit(Number.parseInt(staffNumber, 10) ? Number.parseInt(staffNumber, 10) : null);
	}

	get invalid(): boolean {
		return (!this.formControl.valid || this.isStaffNumberInvalid) && this.formControl.dirty;
	}

	get empty(): boolean {
		return !this.formControl.value && this.formControl.dirty;
	}
}

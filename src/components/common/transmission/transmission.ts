import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { v4 as uuidv4 } from 'uuid';

@Component({
	selector: 'transmission',
	templateUrl: 'transmission.html',
})
export class TransmissionComponent implements OnChanges {
	@Input()
	transmission: GearboxCategory;

	@Input()
	hideTransmissionLabel = false;
	@Input()
	hideConfirmTransmissionLabel = true;

	@Input()
	formGroup: UntypedFormGroup;

	@Output()
	transmissionChange = new EventEmitter<GearboxCategory>();

	uniqueId: string;

	formControl: UntypedFormControl;
	static readonly fieldName: string = 'transmissionCtrl';

	ngOnInit() {
		this.uniqueId = uuidv4();
	}

	ngOnChanges(): void {
		if (!this.formControl) {
			this.formControl = new UntypedFormControl('Transmission', [Validators.required]);
			this.formGroup.addControl(TransmissionComponent.fieldName, this.formControl);
		}
		this.formControl.patchValue(this.transmission);
	}

	transmissionChanged(transmission: GearboxCategory): void {
		this.transmissionChange.emit(transmission);
	}

	isInvalid(): boolean {
		return !this.formControl.valid && this.formControl.dirty;
	}
}

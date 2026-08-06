import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';

@Component({
  selector: 'transmission',
  templateUrl: 'transmission.html',
  styleUrls: ['transmission.scss'],
  standalone: false,
})
export class TransmissionComponent implements OnChanges {
  @Input()
  style?: number;

  @Input()
  transmission: GearboxCategory;
  @Input()
  hideTransmissionLabel = false;
  @Input()
  hideConfirmTransmissionLabel = true;
  @Input()
  shouldShowConfirmationSettings = false;
  @Input()
  shouldShowEditBox = false;
  @Input()
  autoConfirmSelected = false;
  @Input()
  isRekey = false;
  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  transmissionChange = new EventEmitter<GearboxCategory>();

  @Output()
  automaticConfirmChange = new EventEmitter<boolean>();

  @Input()
  isShowingEditBox = true;

  @Output()
  userClickedEditButton = new EventEmitter<void>();

  transmissionFormControl: UntypedFormControl;
  readonly transmissionFieldName: string = 'transmissionCtrl';

  autoCheckboxFormControl: UntypedFormControl;
  readonly autoConfirmFieldName: string = 'automaticConfirmCheckbox';

  deactivateEditMode() {
    this.userClickedEditButton.emit();
    this.setupAutoCheckboxFormControl();
    this.automaticConfirmChanged(false);
    if (this.autoCheckboxFormControl) {
      this.autoCheckboxFormControl.setValue(false, { emitEvent: false });
    }
    this.autoConfirmSelected = false;
  }

  ngOnChanges(): void {
    if (!this.transmissionFormControl) {
      this.transmissionFormControl = new UntypedFormControl('Transmission', [Validators.required]);
      this.formGroup.addControl(this.transmissionFieldName, this.transmissionFormControl);
    }
    this.transmissionFormControl.patchValue(this.transmission);
    this.setupAutoCheckboxFormControl();
  }

  setupAutoCheckboxFormControl() {
    if (
      this.shouldShowConfirmationSettings &&
      this.transmission === 'Automatic' &&
      (!this.shouldShowEditBox || (this.shouldShowEditBox && !this.shouldShowEditBoxOptions()))
    ) {
      if (!this.autoCheckboxFormControl) {
        this.autoCheckboxFormControl = new UntypedFormControl(false, [Validators.requiredTrue]);
        this.formGroup.addControl(this.autoConfirmFieldName, this.autoCheckboxFormControl);
        this.autoCheckboxFormControl.patchValue(this.autoConfirmSelected);
        this.automaticConfirmChanged(this.autoConfirmSelected);
      }
    }
  }

  transmissionChanged(transmission: GearboxCategory): void {
    if (this.shouldShowConfirmationSettings) {
      if (transmission === 'Manual') {
        if (this.autoCheckboxFormControl) {
          this.formGroup.removeControl(this.autoConfirmFieldName);
          this.autoCheckboxFormControl = null;
          this.automaticConfirmChange.emit(undefined);
        }
      } else if (transmission === 'Automatic') {
        this.userClickedEditButton.emit();
        this.setupAutoCheckboxFormControl();
      }
    }
    this.transmissionChange.emit(transmission);
  }

  automaticConfirmChanged(isChecked: boolean): void {
    this.userClickedEditButton.emit();
    this.automaticConfirmChange.emit(isChecked);
  }

  isTransmissionInvalid(): boolean {
    return !this.transmissionFormControl.valid && this.transmissionFormControl.dirty;
  }

  isAutoConfirmInvalid(): boolean {
    if (!this.autoCheckboxFormControl) {
      return false;
    }
    return !this.autoCheckboxFormControl.valid && this.autoCheckboxFormControl.dirty;
  }

  isAutomatic() {
    return this.transmission === 'Automatic';
  }

  shouldShowConfirmation() {
    return this.isAutomatic() && this.shouldShowConfirmationSettings;
  }

  shouldShowEditBoxOptions() {
    return (
      this.isAutomatic() &&
      this.shouldShowConfirmationSettings &&
      this.shouldShowEditBox &&
      this.isShowingEditBox &&
      this.autoConfirmSelected
    );
  }
}

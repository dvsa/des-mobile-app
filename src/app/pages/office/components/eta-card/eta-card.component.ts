import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ETA } from '@dvsa/mes-test-schema/categories/common';

@Component({
  selector: 'eta-card',
  templateUrl: './eta-card.component.html',
  styleUrls: ['./eta-card.component.scss'],
  standalone: false,
})
export class ETACardComponent {
  @Input()
  faults: ETA;
  @Input()
  formGroup: UntypedFormGroup;
  @Input()
  footbrakeETA: boolean;
  @Input()
  handbrakeETA: boolean;
  @Input()
  otherETA: boolean;
  @Input()
  otherETAReason: string;
  @Input()
  steeringETA: boolean;

  @Input()
  shouldShowDetailCheckboxes = true;

  @Output()
  footbrakeETAChanged = new EventEmitter();
  @Output()
  handbrakeETAChanged = new EventEmitter();
  @Output()
  otherETAChanged = new EventEmitter();
  @Output()
  otherETATextChanged = new EventEmitter<string>();
  @Output()
  steeringETAChanged = new EventEmitter();

  formControl: UntypedFormControl;
  readonly fieldName: string = 'etaPhysicalOtherText';

  footbrakeETAChange() {
    this.footbrakeETAChanged.emit();
  }

  handbrakeETAChange() {
    this.handbrakeETAChanged.emit();
  }

  otherETAChange() {
    this.otherETAChanged.emit();
  }

  otherETATextChange(newOther: string) {
    this.otherETATextChanged.emit(newOther);
  }

  steeringETAChange() {
    this.steeringETAChanged.emit();
  }

  readonly etaTypeRequiredField = 'etaPhysicalTypeSelected';
  etaTypeRequiredControl: UntypedFormControl;

  get etaTypeInvalid(): boolean {
    return !!this.etaTypeRequiredControl?.invalid && !!this.etaTypeRequiredControl?.dirty;
  }

  ngOnChanges(): void {
    if (this.shouldShowDetailCheckboxes && this.isPhysicalFault()) {
      if (!this.formControl) {
        this.formControl = new UntypedFormControl();
        if (this.formGroup.contains(this.fieldName)) {
          this.formControl.patchValue(this.formGroup.controls[this.fieldName].value);
          this.formGroup.setControl(this.fieldName, this.formControl);
        } else {
          this.formGroup.addControl(this.fieldName, this.formControl);
        }
      }

      if (this.otherETA) {
        this.formControl.addValidators(Validators.required);
      } else {
        this.formControl.clearValidators();
      }
      this.formControl.updateValueAndValidity();

      this.formControl.patchValue(this.otherETAReason ?? '');

      if (!this.etaTypeRequiredControl) {
        this.etaTypeRequiredControl = new UntypedFormControl(false, Validators.requiredTrue);

        if (this.formGroup.contains(this.etaTypeRequiredField)) {
          this.formGroup.setControl(this.etaTypeRequiredField, this.etaTypeRequiredControl);
        } else {
          this.formGroup.addControl(this.etaTypeRequiredField, this.etaTypeRequiredControl);
        }
      }

      const hasSelectedEtaType = !!(this.steeringETA || this.handbrakeETA || this.footbrakeETA || this.otherETA);

      this.etaTypeRequiredControl.patchValue(hasSelectedEtaType, { emitEvent: false });
      this.etaTypeRequiredControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  getETAFaultText(): string {
    if (!this.faults || (!this.faults.physical && !this.faults.verbal)) return '';
    if (this.faults.physical && !this.faults.verbal) return 'Physical';
    if (!this.faults.physical && this.faults.verbal) return 'Verbal';
    if (this.faults.physical && this.faults.verbal) return 'Physical and verbal';
  }

  isPhysicalFault(): boolean {
    return this.faults?.physical ?? false;
  }

  shouldDisplay(): boolean {
    return this.faults?.physical || this.faults?.verbal;
  }

  get invalid(): boolean {
    if (!this.formControl) {
      return false;
    }
    return !this.formControl.valid && this.formControl.dirty;
  }
}

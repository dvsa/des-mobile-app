import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'eta-card',
  templateUrl: './eta-card.component.html',
  styleUrls: ['./eta-card.component.scss'],
  standalone: false,
})
export class ETACardComponent {
  @Input()
  faults: string;
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

  ngOnChanges(): void {
    if (this.shouldShowDetailCheckboxes) {
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

      if (this.otherETAReason) {
        this.formControl.patchValue(this.otherETAReason);
      }
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}

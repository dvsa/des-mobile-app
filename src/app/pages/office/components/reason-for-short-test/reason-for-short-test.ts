import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'reason-for-short-test',
  templateUrl: 'reason-for-short-test.html',
  imports: [IonicModule, ReactiveFormsModule, DirectivesModule, NgIf],
  standalone: true,
})
export class ReasonForShortTestComponent implements OnChanges {
  @Input()
  display: boolean;

  @Input()
  reasonForShortTest: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  reasonForShortTestChange = new EventEmitter<string>();

  formControl: UntypedFormControl;
  readonly fieldName: string = 'reasonForShortTest';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      if (this.formGroup.contains(this.fieldName)) {
        this.formControl.patchValue(this.formGroup.controls[this.fieldName].value);
        this.formGroup.setControl(this.fieldName, this.formControl);
      } else {
        this.formGroup.addControl(this.fieldName, this.formControl);
      }
    }
    if (this.reasonForShortTest) {
      this.formControl.patchValue(this.reasonForShortTest);
    }
  }

  reasonForShortTestChanged(newReason: string): void {
    this.reasonForShortTestChange.emit(newReason);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}

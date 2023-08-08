import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'true-likeness',
  templateUrl: 'true-likeness.html',
  styleUrls: ['true-likeness.scss'],
})
export class TrueLikenessComponent implements OnChanges {
  @Input()
  trueLikeness: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  trueLikenessChange = new EventEmitter<boolean>();

  formControl: UntypedFormControl;
  private formField: string = 'trueLikeness';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl(this.formField, this.formControl);
    }

    if (this.trueLikeness === true || this.trueLikeness === false) {
      this.formControl.patchValue(String(this.trueLikeness));
    }
  }

  trueLikenessChanged(trueLikeness:string): void {
    if (this.formControl.valid) {
      this.trueLikenessChange.emit(trueLikeness === 'true');
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}

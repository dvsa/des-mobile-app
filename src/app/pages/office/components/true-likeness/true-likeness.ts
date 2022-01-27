import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'true-likeness',
  templateUrl: 'true-likeness.html',
})
export class TrueLikenessComponent implements OnChanges {
  @Input()
  trueLikeness: boolean;

  @Input()
  formGroup: FormGroup;

  @Output()
  trueLikenessChange = new EventEmitter<boolean>();

  private formControl: FormControl;
  private formField: string = 'trueLikeness';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
      this.formGroup.addControl(this.formField, this.formControl);
    }

    this.formControl.patchValue(String(this.trueLikeness));
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

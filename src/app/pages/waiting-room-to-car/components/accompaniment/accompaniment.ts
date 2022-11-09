import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'accompaniment',
  templateUrl: './accompaniment.html',
})
export class AccompanimentComponent implements OnChanges {

  @Input()
  accompaniment: boolean;

  @Input()
  accompanimentType: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  accompanimentChange = new EventEmitter();

  formControl: UntypedFormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl(this.formControlName, this.formControl);
    }
    this.formControl.patchValue(this.accompaniment);
  }

  accompanimentChanged(): void {
    if (this.formControl.valid) {
      this.accompanimentChange.emit();
    }
  }

  get formControlName() {
    return `accompaniment-${this.accompanimentType}`;
  }
}

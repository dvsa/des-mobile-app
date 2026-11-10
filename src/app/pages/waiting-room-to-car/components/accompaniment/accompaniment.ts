import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';

@Component({
  selector: 'accompaniment',
  templateUrl: './accompaniment.html',
  imports: [FormsModule, ReactiveFormsModule, FormatIdPipe],
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

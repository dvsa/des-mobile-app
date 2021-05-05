import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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
  formGroup: FormGroup;

  @Output()
  accompanimentChange = new EventEmitter();

  private formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
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

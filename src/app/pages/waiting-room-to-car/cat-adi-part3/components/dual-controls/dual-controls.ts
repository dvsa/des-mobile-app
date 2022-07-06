import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'dual-controls',
  templateUrl: 'dual-controls.html',
})
export class DualControlsComponent implements OnChanges {

  @Input()
  dualControls: boolean;

  @Input()
  formGroup: FormGroup;

  @Output()
  dualControlsChange = new EventEmitter<boolean>();

  formControl: FormControl;
  static readonly fieldName: string = 'dualControlsCtrl';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
      this.formGroup.addControl(DualControlsComponent.fieldName, this.formControl);
    }

    if (this.dualControls === true || this.dualControls === false) {
      this.formControl.patchValue(String(this.dualControls));
    }
  }

  dualControlsChanged(dualControls: string): void {
    this.dualControlsChange.emit(dualControls === 'true');
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}

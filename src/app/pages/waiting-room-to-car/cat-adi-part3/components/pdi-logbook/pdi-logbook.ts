import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'pdi-logbook',
  templateUrl: 'pdi-logbook.html',
})
export class PDILogbookComponent implements OnChanges {

  @Input()
  pdiLogbook: boolean;

  @Input()
  formGroup: FormGroup;

  @Output()
  pdiLogbookChange = new EventEmitter<boolean>();

  formControl: FormControl;
  static readonly fieldName: string = 'pdiLogbookCtrl';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
      this.formGroup.addControl(PDILogbookComponent.fieldName, this.formControl);
    }

    if (this.pdiLogbook === true || this.pdiLogbook === false) {
      this.formControl.patchValue(String(this.pdiLogbook));
    }
  }

  pdiLogbookChanged(pdiLogbook: string): void {
    this.pdiLogbookChange.emit(pdiLogbook === 'true');
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}

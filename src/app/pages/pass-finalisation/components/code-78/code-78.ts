import {
  Component, Input, OnChanges, Output, EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

enum ValidCode78Values {
  YES = 'yes',
  NO = 'no',
}

@Component({
  selector: 'code-78',
  templateUrl: 'code-78.html',
})

export class Code78Component implements OnChanges {
  @Input()
  form: FormGroup;

  @Input()
  code78: boolean;

  @Output()
  code78Present = new EventEmitter<boolean>();

  formControl: FormControl;
  static readonly fieldName: string = 'code78Ctrl';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
      this.form.addControl(Code78Component.fieldName, this.formControl);
    }

    if (this.code78 !== null) {
      this.formControl.patchValue(this.code78 ? ValidCode78Values.YES : ValidCode78Values.NO);
    } else {
      this.formControl.patchValue(null);
    }
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  code78IsPresent(): void {
    this.code78Present.emit(true);
  }

  code78IsNotPresent(): void {
    this.code78Present.emit(false);
  }
}

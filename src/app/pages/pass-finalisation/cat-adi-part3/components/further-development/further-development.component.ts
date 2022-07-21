import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'further-development',
  templateUrl: './further-development.component.html',
  styleUrls: ['./further-development.component.scss'],
})
export class FurtherDevelopmentComponent implements OnChanges {

  formControl: FormControl;

  @Input()
  formGroup: FormGroup;

  @Input()
  furtherDevelopment: boolean;

  @Output()
  furtherDevelopmentChange = new EventEmitter<boolean>();


  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
      this.formGroup.addControl('furtherDevelopment', this.formControl);

      if (this.furtherDevelopment === true || this.furtherDevelopment === false) {
        this.formControl.patchValue(String(this.furtherDevelopment));
      }
    }
  }

  furtherDevelopmentChanged(furtherDevelopment: string) {
    if (this.formControl.valid) {
      this.furtherDevelopmentChange.emit(furtherDevelopment === 'true');
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}

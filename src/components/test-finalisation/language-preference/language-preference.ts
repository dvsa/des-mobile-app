import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'language-preferences',
  templateUrl: './language-preference.html',
  styleUrls: ['./language-preference.scss'],
})
export class LanguagePreferencesComponent implements OnChanges {

  @Input()
  isWelsh: boolean;

  @Input()
  formGroup: FormGroup;

  @Input()
  isDelegated: boolean = false;

  @Output()
  welshChanged = new EventEmitter<boolean>();

  private formControl: FormControl;
  private formField: string = 'languagePreferences';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, Validators.required);
      this.formGroup.addControl(this.formField, this.formControl);
      this.formGroup.get(this.formField).setValidators([Validators.required]);
    }

    if (this.isDelegated) {
      if (!this.formControl.dirty) {
        this.formControl.patchValue('false');
        this.isWelshChanged('false');
      }
      return;
    }
    this.formControl.patchValue(this.isWelsh);
  }

  isWelshChanged(isWelsh: string): void {
    if (this.formControl.valid) {
      this.welshChanged.emit(isWelsh === 'true');
    }
  }

}

import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'language-preferences',
  templateUrl: './language-preference.html',
})
export class LanguagePreferencesComponent implements OnChanges {

  @Input()
  isWelsh: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  isDelegated: boolean = false;

  @Output()
  welshChanged = new EventEmitter<boolean>();

  private languagePref: UntypedFormControl;

  ngOnChanges(): void {
    if (!this.languagePref) {
      this.languagePref = new UntypedFormControl(null, Validators.required);
      this.formGroup.addControl('languagePreferences', this.languagePref);
      this.formGroup.get('languagePreferences').setValidators([Validators.required]);
    }

    if (this.isDelegated) {
      if (!this.languagePref.dirty) {
        this.languagePref.patchValue('false');
        this.isWelshChanged('false');
      }
      return;
    }
    this.languagePref.patchValue(String(this.isWelsh));
  }

  isWelshChanged(isWelsh: string): void {
    if (this.languagePref.valid) {
      this.welshChanged.emit(isWelsh === 'true');
    }
  }

}

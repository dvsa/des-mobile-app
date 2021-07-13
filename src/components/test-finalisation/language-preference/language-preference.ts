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

  private languagePref: FormControl;

  ngOnChanges(): void {
    if (!this.languagePref) {
      this.languagePref = new FormControl(null, Validators.required);
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
    this.languagePref.patchValue(this.isWelsh);
  }

  isWelshChanged(isWelsh: string): void {
    if (this.languagePref.valid) {
      this.welshChanged.emit(isWelsh === 'true');
    }
  }

}

import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'new-email',
  templateUrl: 'new-email.html',
  styleUrls: ['new-email.scss'],
})
export class NewEmailComponent implements OnChanges {

  static readonly newEmail: string = 'newEmail';
  static readonly newEmailCtrl: string = 'newEmailCtrl';
  static readonly radioCtrl: string = 'radioCtrl';
  maximumCallStackHandler = { emitEvent: false, onlySelf: true };

  @Input()
  formGroup: FormGroup;

  @Input()
  newEmailAddress: string;

  @Input()
  isNewEmailAddressChosen: boolean;

  @Input()
  test: boolean;

  @Output()
  newEmailRadioSelect = new EventEmitter<string>();

  @Output()
  newEmailTextChange = new EventEmitter<string>();

  formControl: FormControl;
  radioButtonControl: FormControl;

  ngOnChanges(): void {
    if (!this.radioButtonControl) {
      this.radioButtonControl = new FormControl('', Validators.required);
      this.formGroup.addControl(NewEmailComponent.radioCtrl, this.radioButtonControl);
    }

    if (!this.formControl) {
      this.formControl = new FormControl('', Validators.required);
      if (this.isNewEmailAddressChosen) {
        this.formControl.setValidators(Validators.compose([Validators.required, Validators.email]));
      }
      this.formGroup.addControl(NewEmailComponent.newEmailCtrl, this.formControl);
    }

    this.formControl.patchValue(this.newEmailAddress);
    this.radioButtonControl.patchValue(!!this.isNewEmailAddressChosen);
  }

  newEmailRadioSelected() {
    this.newEmailRadioSelect.emit(NewEmailComponent.newEmail);
  }

  newEmailTextChanged(email: string) {
    if (this.formControl.valid) {
      this.newEmailTextChange.emit(email);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}

import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'provided-email',
  templateUrl: 'provided-email.html',
  styleUrls: ['provided-email.scss'],
})
export class ProvidedEmailComponent {

  static readonly providedEmail: string = 'Email';
  static readonly radioCtrl: string = 'radioCtrl';

  @Input()
  formGroup: FormGroup;

  @Input()
  providedEmailAddress: string;

  @Input()
  shouldRender: boolean;

  @Input()
  isProvidedEmailAddressChosen: boolean;

  @Output()
  providedEmailRadioSelect = new EventEmitter<string>();

  radioButtonControl: FormControl;

  ngOnChanges() {
    if (!this.radioButtonControl) {
      this.radioButtonControl = new FormControl('', Validators.required);
      this.formGroup.addControl(ProvidedEmailComponent.radioCtrl, this.radioButtonControl);
    }
    this.radioButtonControl.patchValue(!!this.isProvidedEmailAddressChosen);
  }

  providedEmailRadioSelected() {
    this.providedEmailRadioSelect.emit(ProvidedEmailComponent.providedEmail);
  }
}

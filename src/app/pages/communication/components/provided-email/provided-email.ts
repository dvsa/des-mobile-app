import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';
import { BookingEmailSelected } from '@pages/communication/communication.actions';

@Component({
  selector: 'provided-email',
  templateUrl: 'provided-email.html',
  styleUrls: ['provided-email.scss'],
})
export class ProvidedEmailComponent {

  constructor(
    private store$: Store<StoreModel>,
  ) {
  }

  static readonly providedEmail: string = 'Email';
  static readonly radioCtrl: string = 'radioCtrl';

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  providedEmailAddress: string;

  @Input()
  shouldRender: boolean;

  @Input()
  isProvidedEmailAddressChosen: boolean;

  @Output()
  providedEmailRadioSelect = new EventEmitter<string>();

  radioButtonControl: UntypedFormControl;

  ngOnChanges() {
    if (!this.radioButtonControl) {
      this.radioButtonControl = new UntypedFormControl('', Validators.required);
      this.formGroup.addControl(ProvidedEmailComponent.radioCtrl, this.radioButtonControl);
    }
    this.radioButtonControl.patchValue(!!this.isProvidedEmailAddressChosen);
  }

  providedEmailRadioSelected() {
    this.providedEmailRadioSelect.emit(ProvidedEmailComponent.providedEmail);
    this.store$.dispatch(BookingEmailSelected());
  }
}

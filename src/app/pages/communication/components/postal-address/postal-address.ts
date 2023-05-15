import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { Address } from '@dvsa/mes-test-schema/categories/common';
import { UntypedFormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { PostalSelected } from '@pages/communication/communication.actions';

@Component({
  selector: 'postal-address',
  templateUrl: 'postal-address.html',
  styleUrls: ['postal-address.scss'],
})
export class PostalAddressComponent {

  constructor(
    private store$: Store<StoreModel>,
  ) {
  }

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  postalAddress: Address;

  @Input()
  isPostalAddressChosen: boolean;

  @Output()
  postalRadioSelect = new EventEmitter<void>();

  postalRadioSelected() {
    this.postalRadioSelect.emit();
    this.store$.dispatch(PostalSelected());
  }

  ngOnInit() {
    this.postalAddress = this.formatAddress(this.postalAddress);
  }

  formatAddress(address: Address): Address {
    const regex = new RegExp('[0-9]', 'g');
    const formattedAddress: Address = { ...address };
    Object.keys(formattedAddress).forEach((res) => formattedAddress[res] = formattedAddress[res].replace(regex, 'x'));
    return formattedAddress;
  }
}

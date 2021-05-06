import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { Address } from '@dvsa/mes-test-schema/categories/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'postal-address',
  templateUrl: 'postal-address.html',
  styleUrls: ['postal-address.scss'],
})
export class PostalAddressComponent {

  readonly postalType = 'Post';

  @Input()
  formGroup: FormGroup;

  @Input()
  postalAddress: Address;

  @Input()
  isPostalAddressChosen: boolean;

  @Output()
  postalRadioSelect = new EventEmitter<void>();

  postalRadioSelected() {
    this.postalRadioSelect.emit();
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

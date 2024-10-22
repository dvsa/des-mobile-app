import { Component, Input } from '@angular/core';
import { Address } from '@dvsa/mes-test-schema/categories/common';

@Component({
  selector: 'display-address',
  templateUrl: 'display-address.html',
  styleUrls: ['display-address.scss'],
})
export class DisplayAddressComponent {
  @Input()
  blackText?: boolean = false;

  @Input()
  address: Address;
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Address } from '@dvsa/mes-test-schema/categories/common';
import { IonCol, IonRow } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { DisplayAddressComponent } from '../../../../../components/common/display-address/display-address';
import { AddOrRemoveLangCyDirective } from '../../../../../directives/add-or-remove-lang-cy.directive';

@Component({
  selector: 'postal-address',
  templateUrl: 'postal-address.html',
  styleUrls: ['postal-address.scss'],
  imports: [IonRow, AddOrRemoveLangCyDirective, IonCol, DisplayAddressComponent, TranslatePipe],
})
export class PostalAddressComponent {
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
  }

  ngOnInit() {
    this.postalAddress = this.formatAddress(this.postalAddress);
  }

  formatAddress(address: Address): Address {
    const regex = /[0-9]/g;
    const formattedAddress: Address = { ...address };
    Object.keys(formattedAddress).forEach((res) => (formattedAddress[res] = formattedAddress[res].replace(regex, 'x')));
    return formattedAddress;
  }
}

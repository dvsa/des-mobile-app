import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Address } from '@dvsa/mes-test-schema/categories/common';

@Component({
	selector: 'postal-address',
	templateUrl: 'postal-address.html',
	styleUrls: ['postal-address.scss'],
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

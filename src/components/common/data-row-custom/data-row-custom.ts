import { Component, Input } from '@angular/core';

@Component({
	selector: 'data-row-custom',
	templateUrl: 'data-row-custom.html',
	styleUrls: ['data-row-custom.scss'],
})
export class DataRowCustomComponent {
	@Input()
	label: string;

	@Input()
	shouldShowIndicator = false;

	@Input()
	shouldHaveSeperator = true;

	@Input()
	idPrefix?: string;

	@Input()
	centeredLabel = true;

	@Input()
	centeredIcon = true;

	@Input()
	centredData = false;
}

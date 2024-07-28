import { Component, Input } from '@angular/core';
import { SlotComponent } from '@components/test-slot/slot/slot';
import { TestSlot } from '@dvsa/mes-journal-schema';

@Component({
	selector: 'empty-slot',
	templateUrl: 'empty-slot.html',
	styleUrls: ['empty-slot.scss'],
})
export class EmptySlotComponent implements SlotComponent {
	@Input()
	slot: TestSlot;

	@Input()
	hasSlotChanged: boolean;

	@Input()
	showLocation: boolean;

	@Input()
	isPortrait = false;
}

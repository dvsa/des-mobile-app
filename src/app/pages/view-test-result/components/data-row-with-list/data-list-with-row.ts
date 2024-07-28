import { Component, Input } from '@angular/core';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DataRowListItem } from './data-list-with-row.model';

@Component({
	selector: 'data-row-with-list',
	templateUrl: 'data-row-with-list.html',
	styleUrls: ['data-row-with-list.scss'],
})
export class DataRowWithListComponent {
	@Input()
	label: string;

	@Input()
	shouldHaveSeperator = true;

	@Input()
	data: DataRowListItem[];

	constructor(public accessibilityService: AccessibilityService) {}
}

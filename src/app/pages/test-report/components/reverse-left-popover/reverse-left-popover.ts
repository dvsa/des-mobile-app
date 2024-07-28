import { Component, Input } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';

@Component({
	selector: 'reverse-left-popover',
	templateUrl: 'reverse-left-popover.html',
	styleUrls: ['reverse-left-popover.scss'],
})
export class ReverseLeftPopoverComponent {
	@Input()
	testCategory: TestCategory | CategoryCode;

	@Input()
	disableDrivingFaults?: boolean = false;

	manoeuvreTypes = ManoeuvreTypes;
	competencies = ManoeuvreCompetencies;

	getId = (competency: ManoeuvreCompetencies) => `${ManoeuvreTypes.reverseLeft}-${competency}`;

	shouldShowReverseDiagramLink = (): boolean =>
		this.testCategory !== TestCategory.F &&
		this.testCategory !== TestCategory.G &&
		this.testCategory !== TestCategory.H &&
		this.testCategory !== TestCategory.K;
}

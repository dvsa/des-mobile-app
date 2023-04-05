import { Component, Input } from '@angular/core';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'driving-faults',
  templateUrl: './driving-faults.component.html',
})
export class DrivingFaultsComponent {
  @Input()
  label: string;

  @Input()
  faults: FaultSummary[];

  @Input()
  testCategory?: TestCategory;
}

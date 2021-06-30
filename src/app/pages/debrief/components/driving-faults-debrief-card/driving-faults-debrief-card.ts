import { Component, Input } from '@angular/core';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { getDrivingOrRidingLabel } from '@shared/helpers/driver-type';

@Component({
  selector: 'driving-faults-debrief-card',
  templateUrl: 'driving-faults-debrief-card.html',
  styleUrls: ['driving-faults-debrief-card.scss'],
})
export class DrivingFaultsDebriefCardComponent {

  @Input()
  public drivingFaults: FaultSummary[];

  @Input()
  public drivingFaultCount: number;

  @Input()
  public testCategory: TestCategory;

  drivingFaultsCardDescriptionSwitch(testCategory: TestCategory):string {
    return `debrief.${getDrivingOrRidingLabel(testCategory)}FaultsCardDescription`;
  }

}

import { Component, Input } from '@angular/core';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';

@Component({
  selector: 'faults-data-row',
  templateUrl: 'faults-data-row.html',
  styleUrls: ['faults-data-row.scss'],
})
export class FaultsDataRowComponent {

  @Input()
  label: string;

  @Input()
  dangerousFaults: FaultSummary[];

  @Input()
  seriousFaults?: FaultSummary[];

  @Input()
  drivingFaults?: FaultSummary[];

  @Input()
  drivingFaultCount?: number;

  @Input()
  minDrivingFaultCount: number = 15;

  @Input()
  isRider?: boolean = false;

  @Input()
  displayDrivingFaults?: boolean = false;

  @Input()
  testCategory?: TestCategory;

  constructor(public accessibilityService: AccessibilityService) {
  }

  showNoFaultsMessage = (): boolean =>
    this.drivingFaultCount === 0
    && this.seriousFaults.length === 0
    && this.dangerousFaults.length === 0;

  /**
   * Display driving faults comments if driving faults exceed the minimum specified faults and comments exist
   * OR fault comments exist when no serious/dangerous faults exist
   * @param drivingFault
   */
  showFaultComment = (drivingFault: FaultSummary): boolean =>
    this.drivingFaultCount > this.minDrivingFaultCount && drivingFault.comment !== undefined;

  public getDriverType(isRider: boolean): string {
    return isRider ? 'riding' : 'driving';
  }

}

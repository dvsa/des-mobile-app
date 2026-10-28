import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { DangerousFaultBadgeComponent } from '../../../../../components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '../../../../../components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '../../../../../components/common/serious-fault-badge/serious-fault-badge';
import { ModifyCompetencyLabel } from '../../../../shared/pipes/modifyCompetencyLabel';

@Component({
  selector: 'faults-data-row',
  templateUrl: 'faults-data-row.html',
  styleUrls: ['faults-data-row.scss'],
  imports: [
    IonRow,
    IonCol,
    IonGrid,
    NgClass,
    DangerousFaultBadgeComponent,
    SeriousFaultBadgeComponent,
    DrivingFaultsBadgeComponent,
    ModifyCompetencyLabel,
  ],
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
  minDrivingFaultCount = 15;

  @Input()
  isRider?: boolean = false;

  @Input()
  displayDrivingFaults?: boolean = false;

  @Input()
  testCategory?: TestCategory;

  constructor(public accessibilityService: AccessibilityService) {}

  showNoFaultsMessage = (): boolean =>
    this.drivingFaultCount === 0 && this.seriousFaults.length === 0 && this.dangerousFaults.length === 0;

  /**
   * Display driving faults comments if driving faults exceed the minimum specified faults and comments exist
   * OR fault comments exist when no serious/dangerous faults exist
   * @param drivingFault
   */
  showFaultComment = (drivingFault: FaultSummary): boolean =>
    this.drivingFaultCount > this.minDrivingFaultCount && !!drivingFault.comment;

  public getDriverType(isRider: boolean): string {
    return isRider ? 'riding' : 'driving';
  }
}

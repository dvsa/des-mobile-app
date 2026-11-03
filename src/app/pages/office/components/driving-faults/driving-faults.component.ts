import { Component, Input } from '@angular/core';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCard, IonCardContent, IonCardHeader, IonCol, IonRow } from '@ionic/angular';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { ModifyCompetencyLabel } from '@shared/pipes/modifyCompetencyLabel';

@Component({
  selector: 'driving-faults',
  templateUrl: './driving-faults.component.html',
  imports: [IonCard, IonCardHeader, IonCardContent, IonRow, IonCol, DrivingFaultsBadgeComponent, ModifyCompetencyLabel],
})
export class DrivingFaultsComponent {
  @Input()
  label: string;

  @Input()
  faults: FaultSummary[];

  @Input()
  testCategory?: TestCategory;

  @Input()
  badgeLabel = 'Driving';
}

import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCard, IonCardContent, IonCardTitle, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { getDrivingOrRidingLabel } from '@shared/helpers/driver-type';
import { isBikeTest } from '@shared/helpers/simplifiers';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { DrivingFaultsBadgeComponent } from '../../../../../components/common/driving-faults-badge/driving-faults-badge';
import { AddOrRemoveLangCyDirective } from '../../../../../directives/add-or-remove-lang-cy.directive';
import { ModifyCompetencyLabel } from '../../../../shared/pipes/modifyCompetencyLabel';

@Component({
  selector: 'driving-faults-debrief-card',
  templateUrl: 'driving-faults-debrief-card.html',
  styleUrls: ['driving-faults-debrief-card.scss'],
  imports: [
    IonCard,
    IonCardTitle,
    IonText,
    AddOrRemoveLangCyDirective,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    DrivingFaultsBadgeComponent,
    ModifyCompetencyLabel,
    TranslatePipe,
  ],
})
export class DrivingFaultsDebriefCardComponent {
  @Input()
  public drivingFaults: FaultSummary[];

  @Input()
  public drivingFaultCount: number;

  @Input()
  public testCategory: TestCategory;

  drivingFaultsCardDescriptionSwitch(testCategory: TestCategory): string {
    return `debrief.${getDrivingOrRidingLabel(testCategory)}FaultsCardDescription`;
  }

  isRider = (): boolean => isBikeTest(this.testCategory);
}

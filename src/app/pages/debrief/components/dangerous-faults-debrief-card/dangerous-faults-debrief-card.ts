import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCard, IonCardContent, IonCardTitle, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { DangerousFaultBadgeComponent } from '../../../../../components/common/dangerous-fault-badge/dangerous-fault-badge';
import { AddOrRemoveLangCyDirective } from '../../../../../directives/add-or-remove-lang-cy.directive';
import { ModifyCompetencyLabel } from '../../../../shared/pipes/modifyCompetencyLabel';

@Component({
  selector: 'dangerous-faults-debrief-card',
  templateUrl: 'dangerous-faults-debrief-card.html',
  styleUrls: ['dangerous-faults-debrief-card.scss'],
  imports: [
    IonCard,
    IonCardTitle,
    IonText,
    AddOrRemoveLangCyDirective,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    DangerousFaultBadgeComponent,
    ModifyCompetencyLabel,
    TranslatePipe,
  ],
})
export class DangerousFaultsDebriefCardComponent {
  @Input()
  public dangerousFaults: string[];

  @Input()
  public testCategory?: TestCategory;
}

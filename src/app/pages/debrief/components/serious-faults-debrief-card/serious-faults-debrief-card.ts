import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCard, IonCardContent, IonCardTitle, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { SeriousFaultBadgeComponent } from '../../../../../components/common/serious-fault-badge/serious-fault-badge';
import { AddOrRemoveLangCyDirective } from '../../../../../directives/add-or-remove-lang-cy.directive';
import { ModifyCompetencyLabel } from '../../../../shared/pipes/modifyCompetencyLabel';

@Component({
  selector: 'serious-faults-debrief-card',
  templateUrl: 'serious-faults-debrief-card.html',
  styleUrls: ['serious-faults-debrief-card.scss'],
  imports: [
    IonCard,
    IonCardTitle,
    IonText,
    AddOrRemoveLangCyDirective,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    SeriousFaultBadgeComponent,
    ModifyCompetencyLabel,
    TranslatePipe,
  ],
})
export class SeriousFaultsDebriefCardComponent {
  @Input()
  public seriousFaults: string[];

  @Input()
  public testCategory?: TestCategory;
}

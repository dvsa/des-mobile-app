import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { AddOrRemoveLangCyDirective } from '../../../../../directives/add-or-remove-lang-cy.directive';

@Component({
  selector: 'eta-debrief-card',
  templateUrl: 'eta-debrief-card.html',
  styleUrls: ['eta-debrief-card.scss'],
  imports: [IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonText, AddOrRemoveLangCyDirective, TranslatePipe],
})
export class EtaDebriefCardComponent {
  @Input()
  public hasPhysicalEta = false;

  @Input()
  public hasVerbalEta = false;
}

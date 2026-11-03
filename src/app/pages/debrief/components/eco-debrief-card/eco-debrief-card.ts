import { Component, Input } from '@angular/core';
import { AddOrRemoveLangCyDirective } from '@directives/add-or-remove-lang-cy.directive';
import { IonCard, IonCardContent, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'eco-debrief-card',
  templateUrl: 'eco-debrief-card.html',
  styleUrls: ['eco-debrief-card.scss'],
  imports: [IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonText, AddOrRemoveLangCyDirective, TranslatePipe],
})
export class EcoDebriefCardComponent {
  @Input()
  public adviceGivenControl: boolean;

  @Input()
  public adviceGivenPlanning: boolean;
}

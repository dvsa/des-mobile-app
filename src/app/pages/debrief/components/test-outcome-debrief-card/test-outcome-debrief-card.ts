import { Component, Input } from '@angular/core';
import { IonText } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { AddOrRemoveLangCyDirective } from '../../../../../directives/add-or-remove-lang-cy.directive';

@Component({
  selector: 'test-outcome-debrief-card',
  templateUrl: 'test-outcome-debrief-card.html',
  styleUrls: ['test-outcome-debrief-card.scss'],
  imports: [IonText, AddOrRemoveLangCyDirective, TranslatePipe],
})
export class TestOutcomeDebriefCardComponent {
  @Input()
  public outcome: string;

  @Input()
  public grade?: string;
}

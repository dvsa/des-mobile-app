import { Component } from '@angular/core';
import { IonCol, IonRow } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { AddOrRemoveLangCyDirective } from '../../../directives/add-or-remove-lang-cy.directive';

@Component({
  selector: 'lock-screen-indicator',
  templateUrl: 'lock-screen-indicator.html',
  styleUrls: ['lock-screen-indicator.scss'],
  imports: [IonRow, IonCol, AddOrRemoveLangCyDirective, TranslatePipe],
})
export class LockScreenIndicator {}

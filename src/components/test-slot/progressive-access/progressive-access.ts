import { Component, Input } from '@angular/core';
import { IonText } from '@ionic/angular';

@Component({
  selector: 'progressive-access',
  templateUrl: 'progressive-access.html',
  styleUrls: ['progressive-access.scss'],
  imports: [IonText],
})
export class ProgressiveAccessComponent {
  @Input()
  progressiveAccess: boolean;
}

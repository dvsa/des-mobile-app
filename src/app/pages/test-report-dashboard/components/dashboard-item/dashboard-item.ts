import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent, IonCol, IonIcon, IonRow } from '@ionic/angular';

@Component({
  selector: 'dashboard-item',
  templateUrl: 'dashboard-item.html',
  styleUrls: ['dashboard-item.scss'],
  imports: [IonCard, IonCardContent, IonRow, IonCol, IonIcon],
})
export class DashboardItemComponent {
  @Input()
  title: string;

  @Input()
  isInvalid: boolean;

  @Input()
  isValid: boolean;

  @Input()
  score: number;

  @Input()
  maxScore: number;

  @Input()
  showCompleted: boolean;

  @Input()
  idSelector: string;
}

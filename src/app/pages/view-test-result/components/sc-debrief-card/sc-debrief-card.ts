import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCard, IonCol, IonRow } from '@ionic/angular';

@Component({
  selector: 'sc-debrief-card',
  templateUrl: 'sc-debrief-card.html',
  styleUrls: ['sc-debrief-card.scss'],
  imports: [IonRow, IonCol, IonCard, DatePipe],
})
export class ScDebriefCard {
  @Input()
  startTime: string;

  @Input()
  endTime: string;
}

import { Component, Input } from '@angular/core';
import { IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';

@Component({
  selector: 'finalisation-header',
  templateUrl: './finalisation-header.html',
  styleUrls: ['./finalisation-header.scss'],
  imports: [IonGrid, IonRow, IonCol, IonText],
})
export class FinalisationHeaderComponent {
  @Input()
  candidateName: string;

  @Input()
  candidateDriverNumber: string;

  @Input()
  candidatePrnNumber: number;

  @Input()
  isStandardsCheck: boolean;

  @Input()
  outcomeText: string;

  @Input()
  grade: string;
}

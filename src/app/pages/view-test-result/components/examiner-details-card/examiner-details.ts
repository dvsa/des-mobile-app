import { Component, Input } from '@angular/core';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { IonCard, IonCardContent, IonCardHeader, IonGrid } from '@ionic/angular';
import { ExaminerDetailsModel } from './examiner-details-card.model';

@Component({
  selector: 'examiner-details-card',
  templateUrl: 'examiner-details-card.html',
  imports: [IonCard, IonCardHeader, IonCardContent, IonGrid, DataRowComponent],
})
export class ExaminerDetailsCardComponent {
  @Input()
  data: ExaminerDetailsModel;
}

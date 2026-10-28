import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonGrid } from '@ionic/angular';
import { DataRowComponent } from '../../../../../components/common/data-row/data-row';
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

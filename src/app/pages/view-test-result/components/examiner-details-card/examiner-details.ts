import { Component, Input } from '@angular/core';
import { ExaminerDetailsModel } from './examiner-details-card.model';

@Component({
  selector: 'examiner-details-card',
  templateUrl: 'examiner-details-card.html',
})
export class ExaminerDetailsCardComponent {

  @Input()
  data: ExaminerDetailsModel;

}

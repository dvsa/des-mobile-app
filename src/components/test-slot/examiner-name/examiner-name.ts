import { Component, Input } from '@angular/core';

@Component({
  selector: 'examiner-name',
  templateUrl: 'examiner-name.html',
  styleUrls: ['examiner-name.scss'],
})
export class ExaminerNameComponent {

  @Input()
  examinerName: string;
}

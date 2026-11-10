import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StudentLevel } from '@dvsa/mes-test-schema/categories/ADI3';
import { IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonRow } from '@ionic/angular';
import { AssessmentAnswerComponent } from '../assessment-answer/assessment-answer';

@Component({
  selector: 'student-level',
  templateUrl: 'student.html',
  imports: [IonCard, IonCardHeader, IonCardContent, IonGrid, IonRow, IonCol, AssessmentAnswerComponent],
})
export class StudentComponent {
  @Input()
  studentLevel: StudentLevel;

  @Output()
  studentLevelChange = new EventEmitter<StudentLevel>();

  studentLevelChanged = (student: string): void => {
    this.studentLevelChange.emit(student as StudentLevel);
  };
}

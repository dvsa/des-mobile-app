import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { StudentLevel } from '@dvsa/mes-test-schema/categories/ADI3';

@Component({
  selector: 'student-level',
  templateUrl: 'student.html',
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

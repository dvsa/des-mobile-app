import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'accompaniment-card',
  templateUrl: './accompaniment-card.html',
  styleUrls: ['./accompaniment-card.scss'],
})
export class AccompanimentCardComponent {

  @Input()
  instructorAccompaniment: boolean;

  @Input()
  supervisorAccompaniment: boolean;

  @Input()
  otherAccompaniment: boolean;

  @Input()
  interpreterAccompaniment: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  instructorAccompanimentChange = new EventEmitter();

  @Output()
  supervisorAccompanimentChange = new EventEmitter();

  @Output()
  otherAccompanimentChange = new EventEmitter();

  @Output()
  interpreterAccompanimentChange = new EventEmitter();

  instructorAccompanimentChanged(): void {
    this.instructorAccompanimentChange.emit();
  }

  supervisorAccompanimentChanged(): void {
    this.supervisorAccompanimentChange.emit();
  }

  otherAccompanimentChanged(): void {
    this.otherAccompanimentChange.emit();
  }

  interpreterAccompanimentChanged(): void {
    this.interpreterAccompanimentChange.emit();
  }

}

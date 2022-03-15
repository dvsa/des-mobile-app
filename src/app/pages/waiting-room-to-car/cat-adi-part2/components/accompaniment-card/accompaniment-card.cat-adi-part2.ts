import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'accompaniment-card-cat-adi-part2',
  templateUrl: 'accompaniment-card.cat-adi-part2.html',
})
export class AccompanimentCardCatADIPart2Component {

  @Input()
  instructorAccompaniment: boolean;
  @Input()
  supervisorAccompaniment: boolean;
  @Input()
  otherAccompaniment: boolean;
  @Input()
  interpreterAccompaniment: boolean;
  @Input()
  formGroup: FormGroup;
  @Input()
  onCloseVehicleChecksModal = new EventEmitter<void>();
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

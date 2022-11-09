import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'accompaniment-card-adi3',
  templateUrl: './accompaniment-card.html',
  styleUrls: ['./accompaniment-card.scss'],
})
export class AccompanimentCardADI3Component {

  @Input()
  trainerAccompaniment: boolean;

  @Input()
  supervisorAccompaniment: boolean;

  @Input()
  otherAccompaniment: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  trainerAccompanimentChange = new EventEmitter();

  @Output()
  supervisorAccompanimentChange = new EventEmitter();

  @Output()
  otherAccompanimentChange = new EventEmitter();

  trainerAccompanimentChanged(): void {
    this.trainerAccompanimentChange.emit();
  }

  supervisorAccompanimentChanged(): void {
    this.supervisorAccompanimentChange.emit();
  }

  otherAccompanimentChanged(): void {
    this.otherAccompanimentChange.emit();
  }

}

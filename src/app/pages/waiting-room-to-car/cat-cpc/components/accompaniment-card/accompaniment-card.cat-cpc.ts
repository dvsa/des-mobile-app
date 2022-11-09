import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'accompaniment-card-cat-cpc',
  templateUrl: 'accompaniment-card.cat-cpc.html',
})
export class AccompanimentCardCatCPCComponent {

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  supervisorAccompaniment: boolean;

  @Input()
  interpreterAccompaniment: boolean;

  @Output()
  supervisorAccompanimentChange = new EventEmitter();

  @Output()
  interpreterAccompanimentChange = new EventEmitter();

  supervisorAccompanimentChanged(): void {
    this.supervisorAccompanimentChange.emit();
  }

  interpreterAccompanimentChanged(): void {
    this.interpreterAccompanimentChange.emit();
  }

}

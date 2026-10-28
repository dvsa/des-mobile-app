import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { IonCol, IonRow } from '@ionic/angular';
import { AccompanimentComponent } from '../../../components/accompaniment/accompaniment';

@Component({
  selector: 'accompaniment-card-cat-cpc',
  templateUrl: 'accompaniment-card.cat-cpc.html',
  imports: [IonRow, FormsModule, ReactiveFormsModule, IonCol, AccompanimentComponent],
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

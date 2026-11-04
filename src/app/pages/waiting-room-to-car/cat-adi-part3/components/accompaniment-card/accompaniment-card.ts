import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { IonCol, IonRow } from '@ionic/angular';
import { AccompanimentComponent } from '../../../components/accompaniment/accompaniment';

@Component({
  selector: 'accompaniment-card-adi3',
  templateUrl: './accompaniment-card.html',
  styleUrls: ['./accompaniment-card.scss'],
  imports: [IonRow, FormsModule, ReactiveFormsModule, IonCol, AccompanimentComponent],
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

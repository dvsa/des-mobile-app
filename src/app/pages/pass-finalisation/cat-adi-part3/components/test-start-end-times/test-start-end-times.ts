import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DisplayType } from '@components/common/datetime-input/date-time-input.component';
import { IonDatetime } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  PassFinalisationAmendTimeCancelled,
  PassFinalisationAmendTimeConfirmed,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { StoreModel } from '@shared/models/store.model';

export enum PassFinalisationAmendTimeType {
  StartTime = 'start-time',
  EndTime = 'end-time',
}

@Component({
    selector: 'test-start-end-times',
    templateUrl: 'test-start-end-times.html',
    styleUrls: ['test-start-end-times.scss'],
    standalone: false
})
export class TestStartEndTimesComponent implements OnInit, OnChanges {
  @Input()
  startTime: string;

  @Input()
  endTime: string;

  @Input()
  formGroup: FormGroup;

  @Output()
  testStartTimeChange = new EventEmitter<string>();

  @Output()
  testEndTimeChange = new EventEmitter<string>();

  timeDisplayType = DisplayType.Time;

  private formControlStart: FormControl = null;
  private formControlEnd: FormControl = null;
  public minTime: string;
  public maxTime: string;
  public PassFinalisationAmendTimeType = PassFinalisationAmendTimeType;

  constructor(private store$: Store<StoreModel>) {}

  ngOnInit() {
    this.minTime = this.startTime;
    this.maxTime = this.endTime;
  }

  ngOnChanges(): void {
    if (!this.formControlStart) {
      this.formControlStart = new FormControl(null);
      this.formGroup.addControl('startTime', this.formControlStart);
    }

    if (!this.formControlEnd) {
      this.formControlEnd = new FormControl(null);
      this.formGroup.addControl('endTime', this.formControlEnd);
    }
  }

  timeChanged(event: { control?: string; data: string }) {
    switch (event.control) {
      case 'start-time':
        this.minTime = event.data;
        this.testStartTimeChange.emit(event.data);
        break;
      case 'end-time':
        this.maxTime = event.data;
        this.testEndTimeChange.emit(event.data);
        break;
      default:
        break;
    }
  }

  /**
   * Handles the events from the datetime component to allow actions to be dispatched
   * @param dateTime
   * @param buttonType
   * @param startEndType
   */
  handleEvents(dateTime: IonDatetime, buttonType: string, startEndType: PassFinalisationAmendTimeType): Promise<void> {
    if (buttonType === 'clear') return dateTime.reset();
    if (buttonType === 'done') {
      this.store$.dispatch(PassFinalisationAmendTimeConfirmed(startEndType));
      return dateTime.confirm(true);
    }
    if (buttonType === 'cancel') {
      this.store$.dispatch(PassFinalisationAmendTimeCancelled(startEndType));
      return dateTime.cancel(true);
    }
  }
}

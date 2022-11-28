import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'test-start-end-times',
  templateUrl: 'test-start-end-times.html',
  styleUrls: ['test-start-end-times.scss'],
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

  private formControlStart: FormControl = null;
  private formControlEnd: FormControl = null;
  public minTime: string;
  public maxTime: string;

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

  startTimeChanged(startTime: string) {
    this.minTime = startTime;
    this.testStartTimeChange.emit(startTime);
  }

  endTimeChanged(endTime: string) {
    this.maxTime = endTime;
    this.testEndTimeChange.emit(endTime);
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
}

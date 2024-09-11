import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DisplayType } from '@components/common/datetime-input/date-time-input.component';
import {DateTime, Duration} from '@shared/helpers/date-time';
import {ModalController} from '@ionic/angular';
import {ChangeStartEndTimeModal} from '@pages/pass-finalisation/cat-adi-part3/components/change-start-end-time-modal/change-start-end-time-modal';

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

  timeDisplayType = DisplayType.Time;

  private formControlStart: FormControl = null;
  private formControlEnd: FormControl = null;
  public minTime: string;
  public maxTime: string;

  constructor(public modalController: ModalController) {
  }

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

  modalTimeChanged(event: {startTime: string, endTime: string}) {
    console.log(event)
    this.testStartTimeChange.emit(event.startTime)
    this.testEndTimeChange.emit(event.endTime)
  }

  formatTime(time: string) {
    return DateTime.at(new Date(time)).format('HH:mm');
  }

  findDifferenceInTime(startTime: string, endTime: string) {
    return DateTime.at(new Date(startTime)).compareDuration(DateTime.at(new Date(endTime)), Duration.MINUTE);
  }

  async openTimeEditModal() {
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'changeStartEndTimeModal',
      component: ChangeStartEndTimeModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        startTime: this.startTime,
        endTime: this.endTime
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<{startTime: string, endTime: string}>();
    this.modalTimeChanged(data)
  }
}

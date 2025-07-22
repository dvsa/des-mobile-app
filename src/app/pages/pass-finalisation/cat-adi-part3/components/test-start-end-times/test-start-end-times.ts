import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ChangeStartEndTimeModal } from '@pages/pass-finalisation/cat-adi-part3/components/change-start-end-time-modal/change-start-end-time-modal';
import {
  TestStartEndTimeConfirmBoxChanged,
  TestStartEndTimeEditButtonPressed,
} from '@pages/pass-finalisation/cat-adi-part3/components/test-start-end-times/test-start-end-times.actions';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';

@Component({
  selector: 'test-start-end-times',
  templateUrl: 'test-start-end-times.html',
  styleUrls: ['test-start-end-times.scss'],
})
export class TestStartEndTimesComponent implements OnInit, OnChanges {
  static readonly confirmStartEndTimes: string = 'confirmStartEndTimes';
  @Input()
  startTime: string;

  @Input()
  endTime: string;

  @Input()
  formGroup: FormGroup;

  @Input()
  isSelected: boolean;

  @Output()
  testStartTimeChange = new EventEmitter<string>();

  @Output()
  testEndTimeChange = new EventEmitter<string>();

  @Output()
  confirmStartAndEndTime = new EventEmitter<boolean>();

  private formControlStart: FormControl = null;
  private formControlEnd: FormControl = null;
  private formControlConfirm: FormControl = null;

  public minTime: string;
  public maxTime: string;

  constructor(
    public modalController: ModalController,
    public store$: Store<StoreModel> // Assuming Store is imported from a relevant module
  ) {}

  ngOnInit() {
    this.minTime = this.startTime;
    this.maxTime = this.endTime;
  }

  ngOnChanges(): void {
    if (!this.formControlConfirm) {
      this.formControlConfirm = new UntypedFormControl(null, [Validators.requiredTrue]);
      this.formGroup.addControl(TestStartEndTimesComponent.confirmStartEndTimes, this.formControlConfirm);
    }

    if (!this.formControlStart) {
      this.formControlStart = new FormControl(null);
      this.formGroup.addControl('startTime', this.formControlStart);
    }

    if (!this.formControlEnd) {
      this.formControlEnd = new FormControl(null);
      this.formGroup.addControl('endTime', this.formControlEnd);
    }
  }

  modalTimeChanged(event: { startTime: string; endTime: string }) {
    if (event) {
      this.testStartTimeChange.emit(event.startTime);
      this.testEndTimeChange.emit(event.endTime);
    }
  }

  formatTime(time: string) {
    return DateTime.at(new Date(time)).format('HH:mm');
  }

  findDifferenceInTime(startTime: string, endTime: string) {
    return DateTime.at(new Date(startTime)).compareDuration(DateTime.at(new Date(endTime)), Duration.MINUTE);
  }

  selectedValueChanged(selected: boolean) {
    this.store$.dispatch(TestStartEndTimeConfirmBoxChanged(selected));
    this.confirmStartAndEndTime.emit(selected);
  }

  async openTimeEditModal() {
    this.store$.dispatch(TestStartEndTimeEditButtonPressed());
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'changeStartEndTimeModal',
      component: ChangeStartEndTimeModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        startTime: this.startTime,
        endTime: this.endTime,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<{ startTime: string; endTime: string }>();
    this.modalTimeChanged(data);
  }

  isConfirmInvalid(): boolean {
    return !this.formControlConfirm.valid && this.formControlConfirm.dirty;
  }
}

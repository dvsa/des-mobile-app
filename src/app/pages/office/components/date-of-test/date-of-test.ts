import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { isValidStartDate, PRESS_TIME_TO_ENABLE_EDIT } from '@shared/helpers/test-start-time';
import { IonDatetime } from '@ionic/angular';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { DisplayType } from '@components/common/datetime-input/date-time-input.component';
import moment from 'moment';

@Component({
  selector: 'date-of-test',
  templateUrl: 'date-of-test.html',
  styleUrls: ['date-of-test.scss'],
})
export class DateOfTest implements OnInit {

  @Input()
  dateOfTest: string;

  @Output()
  dateOfTestChange = new EventEmitter<string>();

  @Output()
  setIsValidStartDateTime = new EventEmitter<boolean>();

  @ViewChild('editDateInput') inputEl: ElementRef;

  isPressed: boolean = false;
  timeoutId: NodeJS.Timeout;
  editMode: boolean = false;
  isInvalid: boolean = false;

  customTestDate: string = '';
  maxDate: string;
  minDate: string;
  protected readonly DisplayType = DisplayType;

  ngOnInit() {
    this.customTestDate = moment(this.dateOfTest, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.maxDate = new DateTime().format('YYYY-MM-DD');
    this.minDate = new DateTime().subtract(1, Duration.YEAR)
      .format('YYYY-MM-DD');
  }

  handleCancel(dateTime: IonDatetime): Promise<void> {
    return dateTime.cancel(true)
      .then(
        () => {
          this.disableEdit();
        },
      );
  }

  handleDone(dateTime: IonDatetime): Promise<void> {
    return dateTime.confirm(false)
      .then(
        () => {
          // if date not set, then close the modal on done click as fail safe before handling the data;
          if (!dateTime.value) {
            return dateTime.confirm(true);
          }

          const currentDate: string = new DateTime().format('YYYY-MM-DD');
          const selectedDate: string = DateTime.at(dateTime.value as string)
            .format('YYYY-MM-DD');

          if (!isValidStartDate(selectedDate, currentDate)) {
            this.isInvalid = true;
            this.setIsValidStartDateTime.emit(false);
            return;
          }

          this.isInvalid = false;
          this.customTestDate = dateTime.value as string;
          this.setIsValidStartDateTime.emit(true);
          this.dateOfTestChange.emit(this.customTestDate);
          this.disableEdit();
        },
      )
      .finally(() => dateTime.confirm(true));
  }

  onTouchStart() {
    this.isPressed = true;

    setTimeout(() => {
      if (this.isPressed) {
        this.editMode = true;
      }
    }, PRESS_TIME_TO_ENABLE_EDIT);
  }

  onTouchEnd() {
    this.isPressed = false;
  }

  disableEdit = () => this.editMode = false;

  handleEvents(dateTime: IonDatetime, buttonType: string): Promise<void> {
    switch (buttonType) {
      case 'clear':
        return dateTime.reset();
      case 'done':
        return dateTime.confirm()
          .then(() => {
            this.handleDone(dateTime)
              .then(null);
          });
      case 'cancel':
        return dateTime.cancel()
          .then(() => {
            this.handleCancel(dateTime)
              .then(null);
          });
      default:
        break;
    }
  }
}

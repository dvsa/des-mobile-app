import {
  Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import {
  isValidStartDate,
  PRESS_TIME_TO_ENABLE_EDIT,
} from '@shared/helpers/test-start-time';
import { IonDatetime } from '@ionic/angular';

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

  ngOnInit() {
    this.customTestDate = moment(this.dateOfTest, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.maxDate = moment().format('YYYY-MM-DD');
    this.minDate = moment().subtract(1, 'years').format('YYYY-MM-DD');
  }

  handleCancel(dateTime: IonDatetime): Promise<void> {
    return dateTime.cancel(true).then(
      () => {
        this.disableEdit();
      },
    );
  }

  handleDone(dateTime: IonDatetime): Promise<void> {
    return dateTime.confirm(false).then(
      () => {
        // if date not set, then close the modal on done click as fail safe before handling the data;
        if (!dateTime.value) {
          return dateTime.confirm(true);
        }

        const currentDate: string = moment().format('YYYY-MM-DD');
        const selectedDate: string = moment(dateTime.value).format('YYYY-MM-DD');

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
    ).finally(() => dateTime.confirm(true));
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

  enableEdit = () => this.editMode = true;

  disableEdit = () => this.editMode = false;

  handleEvents(dateTime: IonDatetime, buttonType: string) {
    switch (buttonType) {
      case 'clear':
        return dateTime.reset();
      case 'done':
        return dateTime.confirm().then(() => {
          this.handleDone(dateTime).then(null);
        });
      case 'cancel':
        return dateTime.cancel().then(() => {
          this.handleCancel(dateTime).then(null);
        });
      default:
        break;
    }
  }
}

import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'datetime-input',
  templateUrl: './date-time-input.component.html',
  styleUrls: ['./date-time-input.component.scss'],
})
export class DateTimeInputComponent {
  @Input()
  maxValue?: string;

  @Input()
  minValue?: string;

  @Input()
  displayType: string;

  @Input()
  initialValue?: string;

  @Input()
  control?: string;

  @Input()
  inputId?: string;

  @Input()
  pickerId?: string;

  @Input()
  showClearButton?: boolean;

  @Input()
  disabled?: boolean = false;

  displayValue: string;

  @Output()
  onDatePicked = new EventEmitter<{ control: string, date: string }>();

  formatDisplayDate(date: string) {
    const parts = date.match(/(\d+)/g);
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  onDateSelected(date: IonDatetime) {
    const outputDate = date.value.toString().substring(0, date.value.toString().indexOf('T'));
    this.onDatePicked.emit({
      date: outputDate,
      control: this.control,
    });
    this.displayValue = this.formatDisplayDate(outputDate);
  }
}

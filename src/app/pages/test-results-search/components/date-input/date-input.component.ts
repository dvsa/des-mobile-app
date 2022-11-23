import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
})
export class DateInputComponent {
  @Input()
  maxValue?: string;

  @Input()
  minValue?: string;

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
  disabled?: boolean;

  displayDate: string;

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
    this.displayDate = this.formatDisplayDate(outputDate);
  }
}

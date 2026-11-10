import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'date',
  templateUrl: 'date.html',
  styleUrls: ['date.scss'],
  imports: [DatePipe],
})
export class DateComponent {
  @Input()
  date: string;
}

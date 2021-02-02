import { Component, Input } from '@angular/core';

@Component({
  selector: 'date',
  templateUrl: 'date.html',
  styleUrls: ['date.scss'],
})
export class DateComponent {

  @Input()
  date: string;
}

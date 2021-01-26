import { Component, Input } from '@angular/core';

@Component({
  selector: 'date',
  templateUrl: 'date.html',
})
export class DateComponent {

  @Input()
  date: string;
}

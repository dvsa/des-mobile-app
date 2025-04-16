import { Component, Input } from '@angular/core';

@Component({
    selector: 'date',
    templateUrl: 'date.html',
    styleUrls: ['date.scss'],
    standalone: false
})
export class DateComponent {
  @Input()
  date: string;
}

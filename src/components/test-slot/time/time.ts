import { DatePipe, NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonText } from '@ionic/angular';

@Component({
  selector: 'time',
  templateUrl: 'time.html',
  styleUrls: ['time.scss'],
  imports: [IonText, NgClass, DatePipe],
})
export class TimeComponent implements OnInit {
  @Input()
  time: string;

  @Input()
  testComplete: boolean;

  @Input()
  isUnSubmittedTestSlotView = false;

  ngOnInit() {
    this.testComplete = true;
  }
}

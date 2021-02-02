import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'time',
  templateUrl: 'time.html',
  styleUrls: ['time.scss'],
})
export class TimeComponent implements OnInit {

  @Input()
  time: string;

  @Input()
  testComplete: boolean;

  ngOnInit() {
    this.testComplete = true;
  }
}

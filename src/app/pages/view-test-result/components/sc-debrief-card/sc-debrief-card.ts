import { Component, Input } from '@angular/core';

@Component({
  selector: 'sc-debrief-card',
  templateUrl: 'sc-debrief-card.html',
})
export class ScDebriefCard {

  @Input()
  startTime: string;

  @Input()
  endTime: string;
}

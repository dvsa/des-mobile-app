import { Component, Input } from '@angular/core';
import { DateTime, Duration } from '@shared/helpers/date-time';

@Component({
  selector: 'sc-debrief-card',
  templateUrl: 'sc-debrief-card.html',
  styleUrls: ['sc-debrief-card.scss'],
})
export class ScDebriefCard {
  @Input()
  startTime: string;

  @Input()
  endTime: string;

  findDifferenceInTime(startTime: string, endTime: string) {
    return DateTime.at(new Date(startTime)).compareDuration(DateTime.at(new Date(endTime)), Duration.MINUTE);
  }
}

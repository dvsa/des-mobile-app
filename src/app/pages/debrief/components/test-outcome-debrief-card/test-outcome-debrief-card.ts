import { Component, Input } from '@angular/core';

@Component({
  selector: 'test-outcome-debrief-card',
  templateUrl: 'test-outcome-debrief-card.html',
  styleUrls: ['test-outcome-debrief-card.scss'],
})
export class TestOutcomeDebriefCardComponent {

  @Input()
  public outcome: string;

  @Input()
  public grade?: string;

}

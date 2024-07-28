import { Component, Input } from '@angular/core';

@Component({
  selector: 'tick-indicator',
  templateUrl: 'tick-indicator.html',
  styleUrls: ['./tick-indicator.scss'],
})
export class TickIndicatorComponent {
  @Input()
  ticked: boolean;
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'tick-indicator',
  templateUrl: 'tick-indicator.html',
})
export class TickIndicatorComponent {
  @Input()
  ticked: boolean;
}

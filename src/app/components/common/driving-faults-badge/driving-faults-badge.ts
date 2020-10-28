import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-driving-faults-badge',
  templateUrl: 'driving-faults-badge.html',
})
export class DrivingFaultsBadgeComponent {
  @Input()
  count: number;

  @Input()
  showOnZero = false;

  shouldDisplay = () => {
    return this.showOnZero || this.count > 0;
  }
}

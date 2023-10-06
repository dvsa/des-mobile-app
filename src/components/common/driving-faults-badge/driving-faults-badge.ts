import { Component, Input } from '@angular/core';

@Component({
  selector: 'driving-faults-badge',
  templateUrl: './driving-faults-badge.html',
  styleUrls: ['./driving-faults-badge.scss'],
})
export class DrivingFaultsBadgeComponent {
  @Input()
  count: number;

  @Input()
  competencyDisplayName?: string = null;

  @Input()
  showOnZero: boolean = false;

  @Input()
  header: string = 'Driving';

  shouldDisplay = () => {
    return this.showOnZero || this.count > 0;
  };
}

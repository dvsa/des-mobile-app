import { Component, Input } from '@angular/core';

@Component({
  selector: 'dangerous-fault-badge',
  templateUrl: './dangerous-fault-badge.html',
  styleUrls: ['./dangerous-fault-badge.scss'],
})
export class DangerousFaultBadgeComponent {

  @Input()
  showBadge: boolean;

  @Input()
  competencyDisplayName?: string;
}

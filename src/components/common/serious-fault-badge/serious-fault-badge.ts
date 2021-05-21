import { Component, Input } from '@angular/core';

@Component({
  selector: 'serious-fault-badge',
  templateUrl: 'serious-fault-badge.html',
  styleUrls: ['serious-fault-badge.scss'],
})
export class SeriousFaultBadgeComponent {

  @Input()
  showBadge: boolean;
}

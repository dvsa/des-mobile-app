import { Component, Input } from '@angular/core';

@Component({
  selector: 'serious-fault-badge',
  templateUrl: 'serious-fault-badge.html',
})
export class SeriousFaultBadgeComponent {

  @Input()
  showBadge: boolean;
}

import { Component, Input } from '@angular/core';

@Component({
    selector: 'dangerous-tooltip',
    templateUrl: 'dangerous-tooltip.html',
    styleUrls: ['dangerous-tooltip.scss'],
    standalone: false
})
export class DangerousTooltipComponent {
  @Input()
  isRemoveMode = false;
}

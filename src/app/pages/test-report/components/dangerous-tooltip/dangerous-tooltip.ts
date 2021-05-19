import { Component, Input } from '@angular/core';

@Component({
  selector: 'dangerous-tooltip',
  templateUrl: 'dangerous-tooltip.html',
  styleUrls: ['dangerous-tooltip.scss'],
})
export class DangerousTooltipComponent {
  @Input()
  isRemoveMode: boolean = false;
}

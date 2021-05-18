import { Component, Input } from '@angular/core';

// TODO: Serious Tooltip should not cover the Dangerous button
@Component({
  selector: 'serious-tooltip',
  templateUrl: 'serious-tooltip.html',
})
export class SeriousTooltipComponent {
  @Input()
  isRemoveMode: boolean = false;
}

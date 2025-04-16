import { Component, Input } from '@angular/core';

@Component({
    selector: 'serious-tooltip',
    templateUrl: 'serious-tooltip.html',
    styleUrls: ['serious-tooltip.scss'],
    standalone: false
})
export class SeriousTooltipComponent {
  @Input()
  isRemoveMode = false;
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'warning-banner',
  templateUrl: 'warning-banner.html',
  styleUrls: ['warning-banner.scss'],
})
export class WarningBannerComponent {

  @Input()
  warningIdentifier?: string = null;

  @Input()
  warningText: string;

}

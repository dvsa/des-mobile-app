import { Component, Input } from '@angular/core';

@Component({
  selector: 'danger-banner',
  templateUrl: 'danger-banner.html',
  styleUrls: ['danger-banner.scss'],
})
export class DangerBannerComponent {

  @Input()
  dangerText: string;

}

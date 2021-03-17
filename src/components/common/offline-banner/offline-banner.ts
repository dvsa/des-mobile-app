import { Component, Input } from '@angular/core';

@Component({
  selector: 'offline-banner',
  templateUrl: 'offline-banner.html',
})
export class OfflineBannerComponent {

  @Input()
  isOnline: boolean;

}

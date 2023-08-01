import { Component, Input } from '@angular/core';

@Component({
  selector: 'offline-banner',
  templateUrl: 'offline-banner.html',
  styleUrls: ['offline-banner.scss'],
})
export class OfflineBannerComponent {

  @Input()
  isOffline: boolean;

  hasBeenOffline: boolean = false;

  hasBeenOfflineSet() {
    this.hasBeenOffline = true;
  }

}

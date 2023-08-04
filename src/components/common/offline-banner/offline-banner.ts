import {
  Component, Input, OnChanges, SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'offline-banner',
  templateUrl: 'offline-banner.html',
  styleUrls: ['offline-banner.scss'],
})
export class OfflineBannerComponent implements OnChanges {

  @Input()
  isOffline: boolean;

  hasBeenOffline: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isOffline?.currentValue === true) {
      this.hasBeenOffline = true;
    }
  }
}

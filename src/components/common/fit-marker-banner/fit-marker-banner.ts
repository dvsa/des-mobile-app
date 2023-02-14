import { Component, Input } from '@angular/core';

@Component({
  selector: 'fit-marker-banner',
  templateUrl: 'fit-marker-banner.html',
  styleUrls: ['fit-marker-banner.scss'],
})
export class FitMarkerBannerComponent {

  @Input()
  fitCaseNumber: string;

}

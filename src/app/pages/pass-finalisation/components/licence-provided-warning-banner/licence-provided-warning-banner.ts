import { Component, Input } from '@angular/core';

@Component({
  selector: 'licence-provided-warning-banner',
  templateUrl: 'licence-provided-warning-banner.html',
  styleUrls: ['license-provided-warning-banner.scss'],
})

export class LicenceProvidedWarningBannerComponent {
  @Input()
  licenceProvided: boolean;

  yesText: string = 'Please retain the candidate\'s licence';
  noText: string = 'Please ensure the licence is kept by the candidate';

}

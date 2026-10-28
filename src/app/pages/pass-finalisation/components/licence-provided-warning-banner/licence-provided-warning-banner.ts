import { Component, Input } from '@angular/core';
import { WarningBannerComponent } from '../../../../../components/common/warning-banner/warning-banner';

@Component({
  selector: 'licence-provided-warning-banner',
  templateUrl: './licence-provided-warning-banner.html',
  imports: [WarningBannerComponent],
})
export class LicenceProvidedWarningBannerComponent {
  @Input()
  licenceProvided: boolean;

  yesText = "Please retain the candidate's licence.";
  noText = 'Please ensure the licence is kept by the candidate.';
}

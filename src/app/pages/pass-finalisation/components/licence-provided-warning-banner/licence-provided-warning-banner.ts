import { Component, Input } from '@angular/core';

@Component({
	selector: 'licence-provided-warning-banner',
	templateUrl: './licence-provided-warning-banner.html',
})
export class LicenceProvidedWarningBannerComponent {
	@Input()
	licenceProvided: boolean;

	yesText = "Please retain the candidate's licence.";
	noText = 'Please ensure the licence is kept by the candidate.';
}

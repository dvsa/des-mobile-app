import { Component, Input } from '@angular/core';
import { Candidate, CommunicationPreferences, Address } from '@dvsa/mes-test-schema/categories/common';
import { get } from 'lodash';

@Component({
  selector: 'contact-details-card',
  templateUrl: 'contact-details-card.html',
})
export class ContactDetailsCardComponent {

  @Input()
  candidateData: Candidate;

  @Input()
  reSentEmails: { newEmail: string, newLanguage: string, regeneratedDate: string }[];

  @Input()
  communicationPreferencesData: CommunicationPreferences;

  get testResultPreference(): string {
    return get(this.communicationPreferencesData, 'communicationMethod', 'None');
  }

  get phoneNumber(): string {
    return get(this.candidateData, 'primaryTelephone', 'None');
  }

  get oldEmailAddress(): string {
    return get(this.candidateData, 'emailAddress', 'None');
  }

  get newEmailAddress(): string {
    const updatedEmail = get(this.communicationPreferencesData, 'updatedEmail');
    const bookingEmail = get(this.candidateData, 'emailAddress');
    return (updatedEmail && updatedEmail !== bookingEmail) ? updatedEmail : 'Same as booking email';
  }

  get address(): Address {
    return get(this.candidateData, 'candidateAddress');
  }

}

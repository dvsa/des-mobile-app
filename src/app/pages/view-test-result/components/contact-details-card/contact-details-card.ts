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
    if (get(this.communicationPreferencesData, 'updatedEmail')) {
      if (get(this.communicationPreferencesData, 'updatedEmail')
          === get(this.candidateData, 'emailAddress')) {
        return 'Same as Booked';
      }
      return get(this.communicationPreferencesData, 'updatedEmail');
    }
    return 'Same as Booked';
  }

  get address(): Address {
    return get(this.candidateData, 'candidateAddress');
  }

}

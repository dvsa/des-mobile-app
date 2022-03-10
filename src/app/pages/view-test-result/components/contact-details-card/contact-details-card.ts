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

  get emailAddress(): string {
    if (get(this.communicationPreferencesData, 'communicationMethod') === 'Email') {
      return get(this.communicationPreferencesData, 'updatedEmail', 'None');
    }
    return get(this.candidateData, 'emailAddress', 'None');
  }

  get address(): Address {
    return get(this.candidateData, 'candidateAddress');
  }

}

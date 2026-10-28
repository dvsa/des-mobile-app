import { Component, Input } from '@angular/core';
import { Address, Candidate, CommunicationPreferences } from '@dvsa/mes-test-schema/categories/common';
import { IonCard, IonCardContent, IonCardHeader, IonGrid } from '@ionic/angular';
import { RegeneratedEmails } from '@pages/view-test-result/view-test-result.model';
import { get } from 'lodash-es';
import { DataRowCustomComponent } from '../../../../../components/common/data-row-custom/data-row-custom';
import { DataRowComponent } from '../../../../../components/common/data-row/data-row';
import { DisplayAddressComponent } from '../../../../../components/common/display-address/display-address';

@Component({
  selector: 'contact-details-card',
  templateUrl: 'contact-details-card.html',
  imports: [
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonGrid,
    DataRowComponent,
    DataRowCustomComponent,
    DisplayAddressComponent,
  ],
})
export class ContactDetailsCardComponent {
  @Input()
  candidateData: Candidate;

  @Input()
  reEnterEmail: RegeneratedEmails = null;

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
    return updatedEmail && updatedEmail !== bookingEmail ? updatedEmail : 'Same as booking email';
  }

  get address(): Address {
    return get(this.candidateData, 'candidateAddress');
  }
}

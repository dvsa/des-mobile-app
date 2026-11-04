import { Component, Input } from '@angular/core';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { DisplayAddressComponent } from '@components/common/display-address/display-address';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { Address } from '@dvsa/mes-test-schema/categories/common';
import { IonCard, IonCardContent, IonCardHeader, IonGrid } from '@ionic/angular';
import { get } from 'lodash-es';

export type CandidateWithBusinessDetails =
  | CatCUniqueTypes.Candidate
  | CatC1UniqueTypes.Candidate
  | CatCEUniqueTypes.Candidate
  | CatC1EUniqueTypes.Candidate;

@Component({
  selector: 'business-details-card',
  templateUrl: 'business-details-card.html',
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
export class BusinessDetailsCardComponent {
  @Input()
  data: CandidateWithBusinessDetails;

  public shouldHideCard(): boolean {
    return (
      !get(this.data, 'businessName') && !get(this.data, 'businessTelephone') && !get(this.data, 'businessAddress')
    );
  }

  public get businessName(): string {
    return get(this.data, 'businessName', 'Not supplied');
  }

  public get phoneNumber(): string {
    return get(this.data, 'businessTelephone', 'Not supplied');
  }

  public get address(): Address {
    return get(this.data, 'businessAddress');
  }
}

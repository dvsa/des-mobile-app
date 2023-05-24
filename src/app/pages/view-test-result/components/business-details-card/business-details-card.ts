import { Component, Input } from '@angular/core';
import { get } from 'lodash';
import { Address } from '@dvsa/mes-test-schema/categories/common';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';

export type CandidateWithBusinessDetails =
  | CatCUniqueTypes.Candidate
  | CatC1UniqueTypes.Candidate
  | CatCEUniqueTypes.Candidate
  | CatC1EUniqueTypes.Candidate;

@Component({
  selector: 'business-details-card',
  templateUrl: 'business-details-card.html',
})
export class BusinessDetailsCardComponent {

  @Input()
  data: CandidateWithBusinessDetails;

  @Input()
  zoom: string;

  public shouldHideCard() : boolean {
    return (
      !get(this.data, 'businessName')
        && !get(this.data, 'businessTelephone')
        && !get(this.data, 'businessAddress')
    );
  }

  public get businessName() : string {
    return get(this.data, 'businessName', 'Not supplied');
  }

  public get phoneNumber() : string {
    return get(this.data, 'businessTelephone', 'Not supplied');
  }

  public get address() : Address {
    return get(this.data, 'businessAddress');
  }

}

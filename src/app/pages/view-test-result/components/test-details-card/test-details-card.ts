import { Component, Input } from '@angular/core';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { InappropriateUseBannerComponent } from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCard, IonCardContent, IonCardHeader, IonGrid, IonRow } from '@ionic/angular';
import { get } from 'lodash-es';
import { TestDetailsModel } from './test-details-card.model';

export type CandidateDetails = { prn: number; attemptNumber: number };

@Component({
  selector: 'test-details-card',
  templateUrl: 'test-details-card.html',
  styleUrls: ['test-details-card.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonGrid,
    IonRow,
    InappropriateUseBannerComponent,
    DataRowComponent,
    DataRowCustomComponent,
  ],
})
export class TestDetailsCardComponent {
  @Input()
  data: TestDetailsModel;

  @Input()
  candidateDetails: CandidateDetails;

  additionalReqsIsPopulated(additionalReqsArray: string[]): boolean {
    return additionalReqsArray.length > 0 && additionalReqsArray[0] !== 'None';
  }

  showFullCatHeld(): boolean {
    return [TestCategory.CE, TestCategory.C1E, TestCategory.DE, TestCategory.D1E].includes(this.data.category);
  }

  showPrn(): boolean {
    return get(this.candidateDetails, 'prn', null) !== null || typeof get(this.candidateDetails, 'prn') !== 'undefined';
  }

  showAttemptNumber(): boolean {
    return (
      (get(this.candidateDetails, 'attemptNumber', null) !== null ||
        typeof get(this.candidateDetails, 'attemptNumber') !== 'undefined') &&
      this.data.category === TestCategory.SC
    );
  }

  showManoeuvresPassCert(): boolean {
    return !!this.data?.manoeuvrePassCertificateNumber;
  }
}

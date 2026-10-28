import { Component, Input } from '@angular/core';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { IonCard, IonCardContent, IonCardHeader, IonGrid } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';
import { get } from 'lodash-es';
import { DataRowComponent } from '../../../../../components/common/data-row/data-row';

@Component({
  selector: 'rekey-details-card',
  templateUrl: 'rekey-details-card.html',
  imports: [IonCard, IonCardHeader, IonCardContent, IonGrid, DataRowComponent],
})
export class RekeyDetailsCardComponent {
  @Input()
  data: TestResultSchemasUnion;

  public get scheduledStaffNumber(): string {
    return get(this.data, 'examinerBooked')?.toString();
  }

  public get conductedStaffNumber(): string {
    return get(this.data, 'examinerConducted')?.toString();
  }

  public get testDate(): string {
    const testDate: DateTime = new DateTime(get(this.data, 'journalData.testSlotAttributes.start'));
    return testDate.format('dddd Do MMMM YYYY');
  }

  public get rekeyedStaffNumber(): string {
    return get(this.data, 'examinerKeyed')?.toString();
  }

  public get rekeyDate(): string {
    const rekeyDate: DateTime = new DateTime(get(this.data, 'rekeyDate'));
    return rekeyDate.format('dddd Do MMMM YYYY');
  }
}

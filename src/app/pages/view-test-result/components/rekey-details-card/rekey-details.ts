import { Component, Input } from '@angular/core';
import { get } from 'lodash';
import { DateTime } from '@shared/helpers/date-time';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

@Component({
  selector: 'rekey-details-card',
  templateUrl: 'rekey-details-card.html',
})
export class RekeyDetailsCardComponent {

  @Input()
  data: TestResultSchemasUnion;

  public get scheduledStaffNumber(): string {
    return get(this.data, 'examinerBooked')
      ?.toString();
  }

  public get conductedStaffNumber(): string {
    return get(this.data, 'examinerConducted')
      ?.toString();
  }

  public get testDate(): string {
    const testDate: DateTime = new DateTime(get(this.data, 'journalData.testSlotAttributes.start'));
    return testDate.format('dddd Do MMMM YYYY');
  }

  public get rekeyedStaffNumber(): string {
    return get(this.data, 'examinerKeyed')
      ?.toString();
  }

  public get rekeyDate(): string {
    const rekeyDate: DateTime = new DateTime(get(this.data, 'rekeyDate'));
    return rekeyDate.format('dddd Do MMMM YYYY');
  }
}

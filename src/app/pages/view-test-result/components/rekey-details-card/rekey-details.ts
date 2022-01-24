import { Component, Input } from '@angular/core';
import { get } from 'lodash';
import { DateTime } from '@shared/helpers/date-time';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { TestResultCatAM1Schema } from '@dvsa/mes-test-schema/categories/AM1';
import { TestResultCatAM2Schema } from '@dvsa/mes-test-schema/categories/AM2';
import { TestResultCatCPCSchema } from '@dvsa/mes-test-schema/categories/CPC';

@Component({
  selector: 'rekey-details-card',
  templateUrl: 'rekey-details-card.html',
})
export class RekeyDetailsCardComponent {

  @Input()
  data: CatBUniqueTypes.TestResult
  | CatBEUniqueTypes.TestResult
  | CatCUniqueTypes.TestResult
  | CatCEUniqueTypes.TestResult
  | CatC1UniqueTypes.TestResult
  | CatC1EUniqueTypes.TestResult
  | TestResultCatAM1Schema
  | TestResultCatAM2Schema
  | TestResultCatCPCSchema;

  public getScheduledStaffNumber(): string {
    return get(this.data, 'examinerBooked')?.toString();
  }

  public getConductedStaffNumber(): string {
    return get(this.data, 'examinerConducted')?.toString();
  }

  public getTestDate(): string {
    const testDate: DateTime = new DateTime(get(this.data, 'journalData.testSlotAttributes.start'));
    return testDate.format('dddd Do MMMM YYYY');
  }

  public getRekeyedStaffNumber(): string {
    return get(this.data, 'examinerKeyed')?.toString();
  }

  public getRekeyDate(): string {
    const rekeyDate: DateTime = new DateTime(get(this.data, 'rekeyDate'));
    return rekeyDate.format('dddd Do MMMM YYYY');
  }
}

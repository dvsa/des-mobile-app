import { Component, Input, OnChanges } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataUnion } from '@shared/unions/test-schema-unions';

enum driverType {
  R = 'R',
  D = 'D',
}

@Component({
  selector: 'driving-fault-summary',
  templateUrl: 'driving-fault-summary.html',
  styleUrls: ['driving-fault-summary.scss'],
})
export class DrivingFaultSummaryComponent implements OnChanges {
  count = 0;
  driverRiderFlag: driverType;

  @Input()
  testCategory: CategoryCode;

  @Input()
  testData: TestDataUnion;

  constructor(private faultCountProvider: FaultCountProvider) {}

  ngOnChanges() {
    this.count = this.faultCountProvider.getDrivingFaultSumCount(this.testCategory as TestCategory, this.testData);
    this.driverRiderFlag = this.driverTypeSwitch(this.testCategory as TestCategory);
  }

  driverTypeSwitch(cat: TestCategory): driverType {
    // switch to determine Driver or Rider based upon category
    if (cat.includes('EUA')) {
      return driverType.R;
    }
    return driverType.D;
  }
}

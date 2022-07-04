import { Component, Input } from '@angular/core';
import { get, isNil } from 'lodash';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotTypes } from '@shared/models/slot-types';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { getSlotType } from '@shared/helpers/get-slot-type';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { vehicleDetails } from '@components/test-slot/test-slot/test-slot.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { isAnyOf } from '@shared/helpers/simplifiers';

@Component({
  selector: 'fake-test-slot',
  templateUrl: 'fake-test-slot.html',
  styleUrls: ['fake-test-slot.scss'],
})
export class FakeTestSlotComponent {
  @Input()
  slot: TestSlot;

  @Input()
  testStatus: TestStatus;

  @Input()
  hasSlotChanged: boolean;

  @Input()
  showLocation: boolean;

  @Input()
  canStartTest: boolean;

  @Input()
  activityCode: ActivityCode;

  constructor(
    public screenOrientation: ScreenOrientation,
    public appConfig: AppConfigProvider,
    public dateTimeProvider: DateTimeProvider,
  ) {
  }

  isIndicatorNeededForSlot(): boolean {
    const specialNeeds: boolean = this.isSpecialNeedsSlot();
    const checkNeeded: boolean = this.slot.booking.application.entitlementCheck || false;
    const categoryCheckNeeded: boolean = this.slot.booking.application.categoryEntitlementCheck || false;
    const nonStandardTest: boolean = getSlotType(this.slot) !== SlotTypes.STANDARD_TEST;

    return specialNeeds || checkNeeded || categoryCheckNeeded || nonStandardTest;
  }

  isSpecialNeedsSlot(): boolean {
    const specialNeeds = get(this.slot, 'booking.application.specialNeeds', '');
    return !isNil(specialNeeds) && specialNeeds.length > 0;
  }

  isPortrait(): boolean {
    return this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      || this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.PORTRAIT;
  }

  showVehicleDetails(): boolean {
    return vehicleDetails[this.slot.booking.application.testCategory as TestCategory];
  }

  showAdditionalCandidateDetails(): boolean {
    return isAnyOf(this.slot.booking.application.testCategory, [TestCategory.ADI2, TestCategory.ADI3]);
  }
}

import { Injectable } from '@angular/core';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { getFormattedApplicationReference } from '@shared/helpers/formatters';
import { forOwn, has, isEmpty, isNil, isObject } from 'lodash-es';
import { SlotItem } from './slot-item';

@Injectable()
export class SlotSelectorProvider {
  private ignoreBookingProperty: string[] = [
    'entitlementCheck',
    'extendedTest',
    'progressiveAccess',
    'specialNeeds',
    'vehicleSeats',
    'welshTest',
  ];

  public isBookingEmptyOrNull = (slot: SlotItem): boolean => {
    const { slotData } = slot;

    if (!has(slotData, 'booking') || isEmpty((<TestSlot>slotData).booking)) {
      return true;
    }
    return !this.checkPropertiesHaveValues((<TestSlot>slotData).booking);
  };

  public checkPropertiesHaveValues = (obj: {}): boolean => {
    let gotValue = false;

    forOwn(obj, (value, key) => {
      if (this.ignoreBookingProperty.indexOf(key) < 0) {
        if (isObject(value)) {
          if (this.checkPropertiesHaveValues(value)) {
            gotValue = true;
          }
        } else if (!isNil(value)) {
          gotValue = true;
        }
      }
    });
    return gotValue;
  };

  public didSlotPass(slotData: TestSlot, completedTests: SearchResultTestSchema[]): string | null {
    const completedTest = this.getCompletedTest(slotData, completedTests);
    if (!completedTest) {
      return null;
    }
    return completedTest.passCertificateNumber;
  }

  private getCompletedTest = (slotData: TestSlot, completedTests: SearchResultTestSchema[]) => {
    if (isEmpty(completedTests)) {
      return null;
    }

    return completedTests.find((compTest) => {
      return (
        compTest.applicationReference.toString() === getFormattedApplicationReference(slotData.booking.application)
      );
    });
  };
}

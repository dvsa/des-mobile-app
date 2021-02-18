import { Injectable } from '@angular/core';
import {
  has, isEmpty, forOwn, isNil, isObject,
} from 'lodash';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { SlotItem } from './slot-item';
import { TestSlotComponent } from '../../../components/test-slot/test-slot/test-slot';
import { Slot } from '../../../store/journal/journal.model';
import { ActivitySlotComponent } from '../../pages/journal/components/activity-slot/activity-slot';
import { EmptySlotComponent } from '../../pages/journal/components/empty-slot/empty-slot';
import {
  PersonalCommitmentSlotComponent,
} from '../../pages/journal/components/personal-commitment/personal-commitment';

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

  public getSlotTypes = (slotItems: SlotItem[]): SlotItem[] => {
    if (!Array.isArray(slotItems)) {
      return [];
    }

    return slotItems.map((slotItem) => {
      return {
        ...slotItem,
        component: this.resolveComponentName(slotItem), // slotItem
      } as SlotItem;
    });
  };

  private isBookingEmptyOrNull = (slot: SlotItem): boolean => {
    const { slotData } = slot;
    if (!has(slotData, 'booking')) {
      return true;
    }
    let gotValue: boolean = false;
    if (isEmpty((<TestSlot>slotData).booking)) {
      return true;
    }
    gotValue = this.checkPropertiesHaveValues((<TestSlot>slotData).booking);
    return !gotValue;
  };

  private checkPropertiesHaveValues = (obj: any): boolean => {
    let gotValue: boolean = false;

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

  public isTestSlot = (slot: Slot) => has(slot, 'vehicleTypeCode');

  private resolveComponentName = (slot: SlotItem) => {
    const { slotData, personalCommitment } = slot;

    if (!isEmpty(personalCommitment)) {
      return PersonalCommitmentSlotComponent;
    }

    if (has(slotData, 'activityCode')) {
      return ActivitySlotComponent;
    }

    if (this.isBookingEmptyOrNull(slot)) {
      return EmptySlotComponent;
    }

    return TestSlotComponent;
  };
  //
  // private resolveComponentName = () => { // slot: SlotItem
  //   // const { slotData, personalCommitment } = slot;
  //
  //   // if (!isEmpty(personalCommitment)) {
  //   //   return PersonalCommitmentSlotComponent;
  //   // }
  //
  //   // if (has(slotData, 'activityCode')) {
  //   //   return ActivitySlotComponent;
  //   // }
  //
  //   // if (this.isBookingEmptyOrNull(slot)) {
  //   //   return EmptySlotComponent;
  //   // }
  //
  //   return TestSlotComponent;
  // };
}

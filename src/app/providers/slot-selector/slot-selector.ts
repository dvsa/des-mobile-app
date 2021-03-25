import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import {
  has, isEmpty, forOwn, isNil, isObject,
} from 'lodash';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { ActivityCode, SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { SlotItem } from './slot-item';
import { TestSlotComponent } from '../../../components/test-slot/test-slot/test-slot';
import { Slot } from '../../../store/journal/journal.model';
import { ActivitySlotComponent } from '../../pages/journal/components/activity-slot/activity-slot';
import { EmptySlotComponent } from '../../pages/journal/components/empty-slot/empty-slot';
import {
  PersonalCommitmentSlotComponent,
} from '../../pages/journal/components/personal-commitment/personal-commitment';
import { formatApplicationReference } from '../../shared/helpers/formatters';
import { SlotComponent } from '../../../components/test-slot/slot/slot';
import { TestStatus } from '../../../store/tests/test-status/test-status.model';

@Injectable()
export class SlotSelectorProvider {

  constructor(private resolver: ComponentFactoryResolver) {
  }

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
        component: this.resolveComponentName(slotItem),
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

  hasSlotBeenTested(slotData: TestSlot, completedTests: SearchResultTestSchema[]): ActivityCode | null {
    if (isEmpty(completedTests)) {
      return null;
    }

    const applicationReference: ApplicationReference = {
      applicationId: slotData.booking.application.applicationId,
      bookingSequence: slotData.booking.application.bookingSequence,
      checkDigit: slotData.booking.application.checkDigit,
    };

    const completedTest = completedTests.find((compTest) => {
      return compTest.applicationReference === parseInt(formatApplicationReference(applicationReference), 10);
    });

    return completedTest ? completedTest.activityCode : null;
  }

  createSlots = (
    slotContainer: ViewContainerRef,
    emission: SlotItem[],
    completedTests: SearchResultTestSchema[],
    isTeamJournal?: boolean,
  ): void => {
    // Clear any dynamically created slots before adding the latest
    slotContainer.clear();

    if (!Array.isArray(emission)) return;

    if (emission.length === 0) return;

    const slots = this.getSlotTypes(emission);

    let lastLocation;
    // eslint-disable-next-line no-restricted-syntax
    for (const slot of slots) {
      const factory = this.resolver.resolveComponentFactory(slot.component);
      const componentRef = slotContainer.createComponent(factory);

      (<SlotComponent>componentRef.instance).slot = slot.slotData;
      (<SlotComponent>componentRef.instance).hasSlotChanged = slot.hasSlotChanged;
      (<SlotComponent>componentRef.instance).showLocation = (slot.slotData.testCentre.centreName !== lastLocation);
      lastLocation = slot.slotData.testCentre.centreName;

      if (isTeamJournal) (<SlotComponent>componentRef.instance).isTeamJournal = isTeamJournal;

      if (componentRef.instance instanceof PersonalCommitmentSlotComponent) {
        // if this is a personal commitment assign it to the component
        (<PersonalCommitmentSlotComponent>componentRef.instance).personalCommitments = slot.personalCommitment;
      }

      if (componentRef.instance instanceof TestSlotComponent) {
        const activityCode = this.hasSlotBeenTested(slot.slotData as TestSlot, completedTests);

        if (activityCode) {
          (<TestSlotComponent>componentRef.instance).derivedActivityCode = activityCode;
          (<TestSlotComponent>componentRef.instance).derivedTestStatus = TestStatus.Submitted;
        }

        // if this is a test slot assign hasSeenCandidateDetails separately
        (<TestSlotComponent>componentRef.instance).hasSeenCandidateDetails = slot.hasSeenCandidateDetails;
      }
    }
  };

}

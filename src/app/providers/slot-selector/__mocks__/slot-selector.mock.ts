import { Injectable } from '@angular/core';
import { ActivityCode } from '@dvsa/mes-search-schema';
import { SlotItem } from '../slot-item';

@Injectable()
export class SlotSelectorProviderMock {

  private ignoreBookingProperty: string[] = [
    'entitlementCheck',
    'extendedTest',
    'progressiveAccess',
    'specialNeeds',
    'vehicleSeats',
    'welshTest',
  ];

  public getSlotTypes = (): SlotItem[] => {
    return [];
  };

  private isBookingEmptyOrNull = (): boolean => {
    return true;
  };

  private checkPropertiesHaveValues = (): boolean => {
    return true;
  };

  public isTestSlot = () => true;

  private resolveComponentName = () => {
    return {};
  };

  hasSlotBeenTested(): ActivityCode | null {
    return '1';
  }

  createSlots = (): void => { };

}

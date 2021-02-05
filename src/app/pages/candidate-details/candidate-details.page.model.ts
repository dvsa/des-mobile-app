import { Address } from '@dvsa/mes-test-schema/categories/common';

export type Details = {
  testCategory: string,
  slotType: string,
  meetingPlace: string,
  driverNumber: string,
  applicationRef: string,
  specialNeeds: string | string[],
  candidateComments: {
    isSectionEmpty: boolean,
    previousCancellations: string[],
  },
  entitlementCheck: {
    show: boolean,
  }
  phoneNumber: string,
  email: string,
  address: Address,
};

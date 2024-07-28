import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

export interface TestDetailsModel {
  date: string;
  time: string;
  applicationReference: string;
  category: TestCategory;
  slotType: string;
  specialNeeds: string[];
  previousCancellations: string[];
  entitlementCheck: boolean;
  fullLicenceHeld?: boolean;
}

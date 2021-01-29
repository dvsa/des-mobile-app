import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

export type BikeCategoryDetail = {
  testType: BikeTestType;
  categoryCode: CategoryCode;
  displayId: string;
  displayName: string;
  imageUrl: string;
};

export enum BikeTestType {MOD1 = 'MOD1', MOD2 = 'MOD2'}

import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

export enum drivingTypeDescription {
  RIDING = 'riding',
  DRIVING = 'driving',
}

export const getDrivingOrRidingLabel = (cat: TestCategory | null): drivingTypeDescription => {
  // switch to determine driving or riding based upon category
  if (cat && cat.includes('EUA')) {
    return drivingTypeDescription.RIDING;
  }
  return drivingTypeDescription.DRIVING;
};

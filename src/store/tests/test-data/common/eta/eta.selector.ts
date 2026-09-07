import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { ETA, ETAPhysicalType, TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { createSelector } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';

const getSelectedTest = createSelector(getTests, getCurrentTest);

const getETAFromCurrentTest = (test: TestResultSchemasUnion): ETA =>
  (test as TestResultCommonSchema)?.testData?.ETA ?? {};

export const getETAPhysicalTypes = createSelector(
  getSelectedTest,
  (test: TestResultSchemasUnion): ETAPhysicalType => getETAFromCurrentTest(test)?.physicalType ?? {}
);

export const getFootbrakeETAPhysicalType = createSelector(
  getETAPhysicalTypes,
  (etaPhysicalType: ETAPhysicalType): boolean => etaPhysicalType.footbrake
);

export const getHandbrakeETAPhysicalType = createSelector(
  getETAPhysicalTypes,
  (etaPhysicalType: ETAPhysicalType): boolean => etaPhysicalType.handbrake
);

export const getOtherAETAPhysicalType = createSelector(
  getETAPhysicalTypes,
  (etaPhysicalType: ETAPhysicalType): boolean => etaPhysicalType.other
);

export const getOtherTextETAPhysicalType = createSelector(
  getETAPhysicalTypes,
  (etaPhysicalType: ETAPhysicalType): string => etaPhysicalType.otherText
);

export const getSteeringControlETAPhysicalType = createSelector(
  getETAPhysicalTypes,
  (etaPhysicalType: ETAPhysicalType): boolean => etaPhysicalType.steeringControl
);

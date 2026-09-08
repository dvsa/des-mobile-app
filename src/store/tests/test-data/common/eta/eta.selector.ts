import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { ETA, ETAPhysicalType, TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { createSelector } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';

const getSelectedTest = createSelector(getTests, getCurrentTest);

const getETAFromCurrentTest = (test: TestResultSchemasUnion): ETA =>
  (test as TestResultCommonSchema)?.testData?.ETA ?? ({} as ETA);

export const getETAPhysicalTypes = createSelector(
  getSelectedTest,
  (test: TestResultSchemasUnion): ETAPhysicalType =>
    getETAFromCurrentTest(test)?.physicalType ?? ({} as ETAPhysicalType)
);

export const getFootbrakeETAPhysicalType = createSelector(
  getETAPhysicalTypes,
  (etaPhysicalType: ETAPhysicalType): boolean => etaPhysicalType?.footbrake ?? false
);

export const getHandbrakeETAPhysicalType = createSelector(
  getETAPhysicalTypes,
  (etaPhysicalType: ETAPhysicalType): boolean => etaPhysicalType?.handbrake ?? false
);

export const getOtherETAPhysicalType = createSelector(
  getETAPhysicalTypes,
  (etaPhysicalType: ETAPhysicalType): boolean => etaPhysicalType?.other ?? false
);

export const getOtherTextETAPhysicalType = createSelector(
  getETAPhysicalTypes,
  (etaPhysicalType: ETAPhysicalType): string => etaPhysicalType?.otherText ?? ''
);

export const getSteeringControlETAPhysicalType = createSelector(
  getETAPhysicalTypes,
  (etaPhysicalType: ETAPhysicalType): boolean => etaPhysicalType?.steeringControl ?? false
);

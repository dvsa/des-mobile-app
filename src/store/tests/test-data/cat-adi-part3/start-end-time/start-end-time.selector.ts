import { StandardsChecksTestLength, TestData } from '@dvsa/mes-test-schema/categories/ADI3';

export const getTestEndTime = (data: TestData) => data.endTime;
export const getTestStartTime = (data: TestData) => data.startTime;
export const getConfirmedStartAndEndTime = (data: TestData) => data.startEndTimeConfirmed;
export const getStandardsChecksData = (data: TestData) => data.standardsChecksTestLength;
export const getIsTestTooShort = (data: StandardsChecksTestLength) => data.testIsTooShort;
export const getTestTooShortReason = (data: StandardsChecksTestLength) => data.reasonForTestBeingTooShort;

import {
  RekeyReason,
  IpadIssue,
  Transfer,
  Other,
  TestResultCommonSchema,
} from '@dvsa/mes-test-schema/categories/common';

export const getReasonForRekey = (test: TestResultCommonSchema): RekeyReason => test.rekeyReason;
export const getRekeyIpadIssue = (rekeyReason: RekeyReason): IpadIssue => rekeyReason.ipadIssue;
export const getRekeyTransfer = (rekeyReason: RekeyReason): Transfer => rekeyReason.transfer;
export const getRekeyOther = (rekeyReason: RekeyReason): Other => rekeyReason.other;

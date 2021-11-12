import {
  RekeyReason,
  IpadIssue,
  Transfer,
  Other,
  TestResultCommonSchema,
} from '@dvsa/mes-test-schema/categories/common';
import { RekeyReasonModel, RekeyReasonUploadModel } from '@pages/rekey-reason/rekey-reason.model';

export const getReasonForRekey = (test: TestResultCommonSchema): RekeyReason => test.rekeyReason;
export const getRekeyIpadIssue = (rekeyReason: RekeyReason): IpadIssue => rekeyReason.ipadIssue;
export const getRekeyTransfer = (rekeyReason: RekeyReason): Transfer => rekeyReason.transfer;
export const getRekeyOther = (rekeyReason: RekeyReason): Other => rekeyReason.other;

export const getUploadStatus = (rekeyReason: RekeyReasonModel): RekeyReasonUploadModel => {
  console.log('rekeyReason', rekeyReason);
  return rekeyReason.uploadStatus;
};

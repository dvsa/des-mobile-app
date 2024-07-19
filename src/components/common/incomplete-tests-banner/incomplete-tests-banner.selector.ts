/* eslint-disable max-len */
import { JournalModel } from '@store/journal/journal.model';
import { TestsModel } from '@store/tests/tests.model';
import * as testsSelectors from '@store/tests/tests.selector';
import { getPermittedSlotIdsBeforeToday } from '@store/journal/journal.selector';
import { DateTime } from '@shared/helpers/date-time';
import { SlotProvider } from '@providers/slot/slot';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { TestStatus } from '@store/tests/test-status/test-status.model';

/*
  * Incomplete tests are defined as those tests that:
  *  - are prior to today
  *  - the user is permitted to start (from app config)
  *  - haven't been submitted/completed
  *  - are yet to be re-keyed
  *  - are not in progress AND before today
  */
export const getIncompleteTests = (
  journal: JournalModel,
  tests: TestsModel,
  today: DateTime,
  slotProvider: SlotProvider,
  daysToView: number,
): SlotItem[] => {
  const slotIdsOfInProgressTests = testsSelectors.getIncompleteTestsSlotIds(tests);

  return getPermittedSlotIdsBeforeToday(journal, today, slotProvider)
    .filter(({ slotData }) => {
      const isWithinDaysToView = new DateTime(slotData?.slotDetail?.start).daysDiff(today) <= (daysToView || 14);
      const isNotStartedTest = !tests.startedTests[slotData?.slotDetail?.slotId];
      const isNotCompletedTest = ![TestStatus.Submitted, TestStatus.Completed].includes(tests.testStatus[slotData?.slotDetail?.slotId]);

      return isWithinDaysToView && (isNotStartedTest || isNotCompletedTest);
    })
    .filter(({ slotData }) => {
      const { slotId } = slotData.slotDetail;
      const eligibleTests = [
        ...slotIdsOfInProgressTests,
        slotId.toString(),
      ];
      return eligibleTests.includes(slotId.toString());
    });
};

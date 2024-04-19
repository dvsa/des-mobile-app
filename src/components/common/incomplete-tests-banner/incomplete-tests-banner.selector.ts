import { JournalModel } from '@store/journal/journal.model';
import { TestsModel } from '@store/tests/tests.model';
import * as testsSelectors from '@store/tests/tests.selector';
import { getPermittedSlotIdsBeforeToday } from '@store/journal/journal.selector';
import { DateTime } from '@shared/helpers/date-time';
import { SlotProvider } from '@providers/slot/slot';
import { SlotItem } from '@providers/slot-selector/slot-item';

export const getIncompleteTests = (
  journal: JournalModel,
  tests: TestsModel,
  today: DateTime,
  slotProvider: SlotProvider,
): SlotItem[] => {
  /*
    * Incomplete tests are defined as those tests that:
    *  - are prior to today
    *  - the user is permitted to start (from app config)
    *  - haven't been submitted/completed
    *  - are yet to be re-keyed
    *
    * To count the number of incomplete tests, we first get an array of slot IDs of tests that this
    * user is (or was) permitted to start. Test status is not considered, so this list could include
    * completed tests.
    *
    * Then we loop through that list determine if the test is an outstanding rekey (count it) or
    * an incomplete tests (count it too)
    */

  const slotIdsBeforeToday = getPermittedSlotIdsBeforeToday(journal, today, slotProvider);

  // includes tests with status of Started, Decided and WriteUp, but not un-started rekeys
  const slotIdsOfInProgressTests = testsSelectors.getIncompleteTestsSlotIds(tests);
  const completedTestSlotIds = testsSelectors.getCompletedTestSlotIdsBeforeToday(tests);
  const slotIdsOfAllStartedTests = Object.keys(tests.testStatus);

  return slotIdsBeforeToday.filter((slotItem) => {
    const { slotId } = slotItem.slotData.slotDetail;
    // tests that are completed or submitted are omitted from the output
    if (completedTestSlotIds.includes(slotId.toString())) {
      return false;
    }
    // tests that are in the list of in progress tests are incomplete
    if (slotIdsOfInProgressTests.includes(slotId.toString())) {
      return true;
    }
    // tests that are not in the list of started tests are also incomplete
    return !slotIdsOfAllStartedTests.includes(slotId.toString());
  });
};

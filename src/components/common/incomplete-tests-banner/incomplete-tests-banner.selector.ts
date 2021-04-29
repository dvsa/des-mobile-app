import { JournalModel } from '@store/journal/journal.model';
import { TestsModel } from '@store/tests/tests.model';
import * as testsSelectors from '@store/tests/tests.selector';
import { getPermittedSlotIdsBeforeToday } from '@store/journal/journal.selector';
import { DateTime } from '@shared/helpers/date-time';
import { SlotProvider } from '@providers/slot/slot';

export const getIncompleteTestsCount = (
  journal: JournalModel,
  tests: TestsModel, today: DateTime,
  slotProvider: SlotProvider,
): number => {
  /*
    * Incomplete tests are defined as those tests that:
    *  - are prior to today
    *  - the user is permitted to start (from app config)
    *  - haven't been submitted/completed
    *  - are yet to be rekeyed
    *
    * To count the number of incomplete tests, we first get an array of slot IDs of tests that this
    * user is (or was) permitted to start. Test status is not considered, so this list could include
    * completed tests.
    *
    * Then we loop through that list determine if the the test is an outstanding rekey (count it) or
    * an incomplete tests (count it too)
    */

  const slotIdsBeforeToday = getPermittedSlotIdsBeforeToday(journal, today, slotProvider);

  // includes tests with status of Started, Decided and WriteUp, but not unstarted rekeys
  const slotIdsOfInProgressTests = testsSelectors.getIncompleteTestsSlotIds(tests);

  const slotIdsOfAllStartedTests = Object.keys(tests.testStatus);

  return slotIdsBeforeToday.reduce((count, slotId) => {
    // tests that are in the list of in progress tests are incomplete
    if (slotIdsOfInProgressTests.includes(slotId.toString())) {
      return count + 1;
    }
    // tests that are not in the list of started tests are also incomplete
    if (!slotIdsOfAllStartedTests.includes(slotId.toString())) {
      return count + 1;
    }
    return count;
  }, 0);
};

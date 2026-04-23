import { DateTime } from '@shared/helpers/date-time';

export type TestCentreJournalModel = {
  lastRefreshed: DateTime;
  enteredDuringTest: boolean;
};

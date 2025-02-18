import { DateTime } from '@shared/helpers/date-time';
import { isNil } from 'lodash-es';
import { TestCentreJournalModel } from './test-centre-journal.model';

export const getLastRefreshed = (journal: TestCentreJournalModel) => journal.lastRefreshed;
export const getEnteredFromTest = (journal: TestCentreJournalModel) => journal.enteredDuringTest;

export const getLastRefreshedTime = (date: Date) => (isNil(date) ? '--:--' : DateTime.at(date).format('hh:mma'));

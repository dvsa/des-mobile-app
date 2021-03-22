import { isNil } from 'lodash';
import { DateTime } from '../../app/shared/helpers/date-time';
import { TestCentreJournalModel } from './test-centre-journal.model';

export const getLastRefreshed = (journal: TestCentreJournalModel) => journal.lastRefreshed;

export const getLastRefreshedTime = (date: Date) => (
  isNil(date) ? '--:--' : DateTime.at(date).format('hh:mma'));

import { AppConfig } from '@providers/app-config/app-config.model';
import { appConfigFeatureKey } from '@store/app-config/app-config.reducer';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import { appInfoFeatureKey } from '@store/app-info/app-info.reducer';
import { JournalModel } from '@store/journal/journal.model';
import { journalFeatureKey } from '@store/journal/journal.reducer';
import { RefDataStateModel, refDataFeatureKey } from '@store/reference-data/reference-data.reducer';
import { TestCentreJournalModel } from '@store/test-centre-journal/test-centre-journal.model';
import { testCentreJournalFeatureKey } from '@store/test-centre-journal/test-centre-journal.reducer';
import { TestsModel } from '@store/tests/tests.model';
import { testsFeatureKey } from '@store/tests/tests.reducer';

export interface StoreModel {
  [appInfoFeatureKey]: AppInfoStateModel;
  [journalFeatureKey]: JournalModel;
  [appConfigFeatureKey]: AppConfig;
  [testCentreJournalFeatureKey]: TestCentreJournalModel;
  [testsFeatureKey]: TestsModel;
  [refDataFeatureKey]: RefDataStateModel;
}

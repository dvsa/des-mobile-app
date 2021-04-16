import { AppConfig } from '@providers/app-config/app-config.model';
import { appInfoFeatureKey } from '@store/app-info/app-info.reducer';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import { journalFeatureKey } from '@store/journal/journal.reducer';
import { JournalModel } from '@store/journal/journal.model';
import { appConfigFeatureKey } from '@store/app-config/app-config.reducer';
import { TestCentreJournalModel } from '@store/test-centre-journal/test-centre-journal.model';
import { testCentreJournalFeatureKey } from '@store/test-centre-journal/test-centre-journal.reducer';

export interface StoreModel {
  [appInfoFeatureKey]: AppInfoStateModel,
  [journalFeatureKey]: JournalModel,
  [appConfigFeatureKey]: AppConfig,
  [testCentreJournalFeatureKey]: TestCentreJournalModel,
}

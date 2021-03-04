import { appInfoFeatureKey } from '../../../store/app-info/app-info.reducer';
import { AppInfoStateModel } from '../../../store/app-info/app-info.model';
import { journalFeatureKey } from '../../../store/journal/journal.reducer';
import { JournalModel } from '../../../store/journal/journal.model';
import { appConfigFeatureKey } from '../../../store/app-config/app-config.reducer';
import { AppConfig } from '../../providers/app-config/app-config.model';

export interface StoreModel {
  [appInfoFeatureKey]: AppInfoStateModel,
  [journalFeatureKey]: JournalModel,
  [appConfigFeatureKey]: AppConfig,
}

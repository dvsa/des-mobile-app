import { appInfoFeatureKey } from '../../../store/app-info/app-info.reducer';
import { AppInfoStateModel } from '../../../store/app-info/app-info.model';

export interface StoreModel {
  [appInfoFeatureKey]: AppInfoStateModel,
}

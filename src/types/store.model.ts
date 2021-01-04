import { appInfoFeatureKey } from '../store/app-info/app-info.reducer';
import { AppInfoStateModel } from './app-info.model';

export interface StoreModel {
  [appInfoFeatureKey]: AppInfoStateModel,
}

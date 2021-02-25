import { StoreModel } from '../../app/shared/models/store.model';
import { AppConfig } from '../../app/providers/app-config/app-config.model';

export const selectAppConfig = (state: StoreModel): AppConfig => state.appConfig;

import { StoreModel } from '../../app/shared/models/store.model';
import { AppConfig } from '../../app/providers/app-config/app-config.model';
import { createSelector } from '@ngrx/store';

export const selectAppConfig = (state: StoreModel): AppConfig => state.appConfig;

export const selectRole = createSelector(
  selectAppConfig,
  (appConfig: AppConfig): string => appConfig.role,
);

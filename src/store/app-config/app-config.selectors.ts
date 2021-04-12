import { createSelector } from '@ngrx/store';
import { AppConfig } from '@providers/app-config/app-config.model';
import { StoreModel } from '../../app/shared/models/store.model';

export const selectAppConfig = (state: StoreModel): AppConfig => state.appConfig;

export const selectRole = createSelector(
  selectAppConfig,
  (appConfig: AppConfig): string => appConfig.role,
);

export const selectLogoutEnabled = createSelector(
  selectAppConfig,
  (appConfig: AppConfig): boolean => appConfig.journal.enableLogoutButton,
);

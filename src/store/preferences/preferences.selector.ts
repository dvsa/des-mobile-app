import { StoreModel } from '@shared/models/store.model';
import { PreferencesStateModel } from '@store/preferences/preferences.reducer';
import { createSelector } from '@ngrx/store';

export const selectPreferences = (state: StoreModel): PreferencesStateModel => state.preferences;

export const selectEnableSAMForDeviceAuth = createSelector(
  selectPreferences,
  (preference) => preference.enableSAMForDeviceAuth,
);

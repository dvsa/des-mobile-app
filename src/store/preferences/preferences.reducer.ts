import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { ResetPreferences, SetPreference } from '@store/preferences/preferences.actions';

export interface PreferencesStateModel {
  enableSAMForDeviceAuth: boolean;
}

export const preferencesFeatureKey = 'preferences';

export const initialState: PreferencesStateModel = {
  enableSAMForDeviceAuth: true,
};

export const preferencesReducer = createReducer(
  initialState,
  on(SetPreference, (state, { preference }) => ({
    ...state,
    [preference]: !state[preference],
  })),
  on(ResetPreferences, () => initialState),
);

export const getPreferencesState = createFeatureSelector<PreferencesStateModel>(
  preferencesFeatureKey,
);

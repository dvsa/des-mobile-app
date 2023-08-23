import { createAction } from '@ngrx/store';
import { PreferencesStateModel } from '@store/preferences/preferences.reducer';

export const SetPreference = createAction(
  '[Preferences] Set preference',
  (preference: keyof PreferencesStateModel) => ({ preference }),
);

export const ResetPreferences = createAction(
  '[Preferences] Reset preferences',
);

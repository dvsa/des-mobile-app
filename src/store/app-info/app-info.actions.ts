import { createAction, props } from '@ngrx/store';
import { UpdateAvailable } from '@pages/dashboard/components/update-available-modal/update-available-modal';

export const LoadAppVersion = createAction(
  '[AppComponent] Load App Version',
);

export const LoadAppVersionSuccess = createAction(
  '[AppInfoEffects] Load App Version Success',
  props<{ versionNumber: string }>(),
);

export const LoadAppVersionFailure = createAction(
  '[AppInfoEffects] Load App Version Failure',
  props<{ error: any }>(),
);

export const LoadEmployeeId = createAction(
  '[LoginComponent] Load Employee ID',
  props<{ employeeId: string }>(),
);

export const LoadEmployeeName = createAction(
  '[LoginComponent] Load Employee Name',
);

export const LoadEmployeeNameSuccess = createAction(
  '[LoginComponent] Load Employee Name Success',
  props<{ employeeName: string }>(),
);

// @TODO: Rename to `LoadRemoteConfigSuccess` at later date
export const LoadConfigSuccess = createAction(
  '[AppInfoEffects] Load Config Success',
);

export const SetDateConfigLoaded = createAction(
  '[AppInfoEffects] Set Date Config Loaded',
  props<{ refreshDate: string }>(),
);

export const HasSeenUpdateAvailablePopup = createAction(
  '[AppInfoEffects] Update available popup',
  (hasSeen: boolean = false) => ({ hasSeen }),
);

export const AppSuspended = createAction(
  '[AppInfoEffects] App Suspended',
);

export const AppResumed = createAction(
  '[AppInfoEffects] App Resumed',
);

export const RestartApp = createAction(
  '[AppInfoEffects] Restart App',
);

export const UpdateAvailablePopup = createAction(
  '[AppInfoEffects] Update available presented',
);

export const UpdateAvailableBadgeClicked = createAction(
  '[AppInfoEffects] Update available badge clicked',
);

export const UpdateAvailableOptionClicked = createAction(
  '[AppInfoEffects] Update available presented',
  (selected: UpdateAvailable) => ({ selected }),
);

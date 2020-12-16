import { createAction, props } from '@ngrx/store';

export const LoadAppInfo = createAction(
  '[AppComponent] Load App Info',
);

export const LoadAppInfoSuccess = createAction(
  '[AppInfoEffects] Load App Info Success',
  props<{ versionNumber: string }>(),
);

export const LoadAppInfoFailure = createAction(
  '[AppInfoEffects] Load App Info Failure',
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

export const LoadConfigSuccess = createAction(
  '[AppInfoEffects] Load Config Success',
);

export const SetDateConfigLoaded = createAction(
  '[AppInfoEffects] Set Date Config Loaded',
  props<{ refreshDate: string }>(),
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

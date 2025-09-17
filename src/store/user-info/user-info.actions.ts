import {createAction, props} from '@ngrx/store';
import {AuthResult} from '@ionic-enterprise/auth';

export const UnloadUserInfo = createAction('[AppComponent] Unload App Info');

export const UpdateAuthResult = createAction(
  '[UserInfoEffects] Load Auth Result',
  (authResult: AuthResult) => ({ authResult })
);

export const LoadEmployeeId = createAction('[LoginComponent] Load Employee ID', props<{ employeeId: string }>());

export const LoadEmployeeName = createAction(
  '[LoginComponent] Load Employee Name',
  (employeeName: string) => ({ employeeName })

);export const LoadEmployeeNameSuccess = createAction(
  '[LoginComponent] Load Employee Name Success',
  props<{ employeeName: string }>()
);

import { createAction } from '@ngrx/store';
import {AuthResult} from '@ionic-enterprise/auth';

export const UnloadUserInfo = createAction('[AppComponent] Unload App Info');

export const UpdateAuthResult = createAction(
  '[UserInfoEffects] Load Auth Result',
  (authResult: AuthResult) => ({ authResult })
);

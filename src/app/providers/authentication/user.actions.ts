import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TokenInfo } from '@providers/auth/authentication/auth-model';
import { USER_FEATURE_NAME } from './user.feature';

export const UserActions = createActionGroup({
  source: USER_FEATURE_NAME,
  events: {
    setTokenInfo: props<{ tokenInfo: TokenInfo }>(),
    getTokenInfo: emptyProps(),
    ClearToken: emptyProps(),
  },
});

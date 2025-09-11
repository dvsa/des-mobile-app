import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TokenInfo } from '@providers/authentication/auth-model';

export const UserActions = createActionGroup({
  source: 'user',
  events: {
    setTokenInfo: props<{ tokenInfo: TokenInfo }>(),
    getTokenInfo: emptyProps(),
    ClearToken: emptyProps(),
  },
});

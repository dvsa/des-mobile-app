import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';
import { TokenInfo } from '@providers/authentication/auth-model';

export interface UserState {
  tokenInfo: TokenInfo | null;
}

export const userInitialState: UserState = {
  tokenInfo: null,
};

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    userInitialState,
    on(UserActions.setTokenInfo, (state, action) => {
      return { ...state, tokenInfo: action.tokenInfo };
    }),
    on(UserActions.clearToken, (state, action) => {
      return userInitialState;
    }),
  ),
});

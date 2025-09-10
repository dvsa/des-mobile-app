import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';

export interface UserState {
  tokenInfo: TokenInfo | null;
}

export const userInitialState: UserState = {
  tokenInfo: null,
};

export const userFeature = createFeature({
  name: USER_FEATURE_NAME,
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

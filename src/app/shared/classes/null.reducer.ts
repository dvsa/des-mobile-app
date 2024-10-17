import {Action} from '@ngrx/store';

export const initialState = null;

export function nullReducer(action: Action, state = initialState): {} {
  return null;
}

export function emptyObjReducer(action: Action, state = {}): {} {
  return {};
}

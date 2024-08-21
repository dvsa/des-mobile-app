export const initialState = null;

export function nullReducer(action: any, state = initialState): {} {
  return null;
}

export function emptyObjReducer(action: any, state = {}): {} {
  return {};
}

import { Action } from '@ngrx/store';

export const TOGGLE_ECO = '[Eco] Toggle Eco';
export const TOGGLE_CONTROL_ECO = '[Eco] Toggle Control Eco';
export const TOGGLE_PLANNING_ECO = '[Eco] Toggle Planning Eco';

export class ToggleEco implements Action {
  readonly type = TOGGLE_ECO;
}

export class ToggleControlEco implements Action {
  readonly type = TOGGLE_CONTROL_ECO;
}

export class TogglePlanningEco implements Action {
  readonly type = TOGGLE_PLANNING_ECO;
}

export type Types =
  | ToggleEco
  | ToggleControlEco
  | TogglePlanningEco;

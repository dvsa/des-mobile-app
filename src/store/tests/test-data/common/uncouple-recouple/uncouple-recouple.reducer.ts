import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';
import { createReducer, on } from '@ngrx/store';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import * as uncoupleRecoupleActions from './uncouple-recouple.actions';

export type UncoupleRecouple =
  | CatCEUniqueTypes.UncoupleRecouple
  | CatC1EUniqueTypes.UncoupleRecouple
  | CatDEUniqueTypes.UncoupleRecouple
  | CatD1EUniqueTypes.UncoupleRecouple;

export const initialState: UncoupleRecouple = {};

export const uncoupleRecoupleReducer = createReducer(
  initialState,
  on(uncoupleRecoupleActions.ToggleUncoupleRecouple, (state): UncoupleRecouple => ({
    ...state,
    selected: !state.selected,
  })),
  on(uncoupleRecoupleActions.UncoupleRecoupleAddDrivingFault, (state): UncoupleRecouple => ({
    ...state,
    fault: CompetencyOutcome.DF,
    selected: true,
  })),
  on(uncoupleRecoupleActions.UncoupleRecoupleAddSeriousFault, (state): UncoupleRecouple => ({
    ...state,
    fault: CompetencyOutcome.S,
    selected: true,
  })),
  on(uncoupleRecoupleActions.UncoupleRecoupleAddDangerousFault, (state): UncoupleRecouple => ({
    ...state,
    fault: CompetencyOutcome.D,
    selected: true,
  })),
  on(uncoupleRecoupleActions.UncoupleRecoupleRemoveFault, (state): UncoupleRecouple => ({
    selected: state.selected,
  })),
  on(uncoupleRecoupleActions.AddUncoupleRecoupleComment, (state, { comment }): UncoupleRecouple => ({
    ...state,
    faultComments: comment,
  })),
);

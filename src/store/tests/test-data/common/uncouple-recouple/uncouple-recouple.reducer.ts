import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';
import * as uncoupleRecoupleActions from './uncouple-recouple.actions';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';

// TODO - We should make a common type in the schema for Uncouple Recouple;
export type UncoupleRecouple =
  | CatBEUniqueTypes.UncoupleRecouple
  | CatCEUniqueTypes.UncoupleRecouple
  | CatC1EUniqueTypes.UncoupleRecouple
  | CatDEUniqueTypes.UncoupleRecouple
  | CatD1EUniqueTypes.UncoupleRecouple;

export const initialState: UncoupleRecouple = {};

export function uncoupleRecoupleReducer(
  state = initialState,
  action: uncoupleRecoupleActions.Types,
): UncoupleRecouple {
  switch (action.type) {
    case uncoupleRecoupleActions.TOGGLE_UNCOUPLE_RECOUPLE:
      return {
        ...state,
        selected: !state.selected,
      };
    case uncoupleRecoupleActions.UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT:
      return {
        ...state,
        fault: CompetencyOutcome.DF,
        selected: true,
      };
    case uncoupleRecoupleActions.UNCOUPLE_RECOUPLE_ADD_SERIOUS_FAULT:
      return {
        ...state,
        fault: CompetencyOutcome.S,
        selected: true,
      };
    case uncoupleRecoupleActions.UNCOUPLE_RECOUPLE_ADD_DANGEROUS_FAULT:
      return {
        ...state,
        fault: CompetencyOutcome.D,
        selected: true,
      };
    case uncoupleRecoupleActions.UNCOUPLE_RECOUPLE_REMOVE_FAULT:
      return {
        selected: state.selected,
      };
    case uncoupleRecoupleActions.ADD_UNCOUPLE_RECOUPLE_COMMENT:
      return {
        ...state,
        faultComments: action.comment,
      };
    default:
      return state;
  }
}

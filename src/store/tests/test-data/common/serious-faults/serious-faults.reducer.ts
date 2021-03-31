import { SeriousFaults } from '@dvsa/mes-test-schema/categories/common';
import * as seriousFaultsActions from './serious-faults.actions';

export const initialState: SeriousFaults = {};

export function seriousFaultsReducer(
  state = initialState,
  action: seriousFaultsActions.Types,
): SeriousFaults {
  switch (action.type) {
    case seriousFaultsActions.ADD_SERIOUS_FAULT:
      return {
        ...state,
        [action.payload]: true,
      };
    case seriousFaultsActions.REMOVE_SERIOUS_FAULT:
      const seriousCompetency = action.payload;
      const { [seriousCompetency]: removedSeriousFault, ...updatedSeriousFaults } = state;
      return updatedSeriousFaults;
    case seriousFaultsActions.ADD_SERIOUS_FAULT_COMMENT:
      return {
        ...state,
        [`${action.competencyName}Comments`]: action.comment,
      };
    default:
      return state;
  }
}

import { singleFaultCompetenciesReducer, initialState } from '../single-fault-competencies.reducer';
import * as singleFaultCompetencyActions from '../single-fault-competencies.actions';
import { SingleFaultCompetencies } from '@dvsa/mes-test-schema/categories/AM1';
import { SingleFaultCompetencyNames } from '../../../test-data.constants';
import { CompetencyOutcome } from '../../../../../../shared/models/competency-outcome';

describe('single fault competencies reducer', () => {

  describe('handle SetSingleFaultCompetencyOutcome', () => {
    it('should set the outcome for the specified single fault competency', () => {
      const state: SingleFaultCompetencies = { ...initialState };
      const action = new singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome(
        SingleFaultCompetencyNames.uTurn, CompetencyOutcome.DF);
      const result = singleFaultCompetenciesReducer(state, action);
      expect(result).toEqual({
        ...initialState,
        uTurn: CompetencyOutcome.DF,
      });
    });
  });

  describe('handle remove single fault competency outcome', () => {
    it('should remove the specified single fault competency', () => {
      const state: SingleFaultCompetencies = {
        [SingleFaultCompetencyNames.uTurn]: CompetencyOutcome.DF,
        [SingleFaultCompetencyNames.controlledStop]: CompetencyOutcome.D,
      };
      const action = new singleFaultCompetencyActions.RemoveSingleFaultCompetencyOutcome(
        SingleFaultCompetencyNames.controlledStop);
      const result: SingleFaultCompetencies = singleFaultCompetenciesReducer(state, action);
      expect(result).toEqual({
        [SingleFaultCompetencyNames.uTurn]: CompetencyOutcome.DF,
      });
    });
  });

  describe('handle add single fault comment', () => {
    it('should add a comment to the specified fault', () => {
      const state: SingleFaultCompetencies = { ...initialState };
      const action = new singleFaultCompetencyActions.AddSingleFaultCompetencyComment(
        SingleFaultCompetencyNames.controlledStop, 'some controlled stop comments');
      const result: SingleFaultCompetencies = singleFaultCompetenciesReducer(state, action);
      expect(result).toEqual({
        controlledStopComments: 'some controlled stop comments',
      });
    });
  });

});

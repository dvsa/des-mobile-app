import { SeriousFaults } from '@dvsa/mes-test-schema/categories/common';
import { Competencies } from '../../../test-data.constants';
import { AddSeriousFault, AddSeriousFaultComment, RemoveSeriousFault } from '../serious-faults.actions';
import { seriousFaultsReducer } from '../serious-faults.reducer';

describe('Serious Faults Reducer', () => {
  describe('ADD SERIOUS FAULT', () => {
    it('should add a serious fault when none exist', () => {
      const state: SeriousFaults = {};
      const result = seriousFaultsReducer(state, AddSeriousFault(Competencies.followingDistance));
      expect(result.followingDistance).toEqual(true);
    });
    it('should not remove an existing serious fault when a  one is added', () => {
      const state: SeriousFaults = {
        followingDistance: true,
      };
      const result = seriousFaultsReducer(state, AddSeriousFault(Competencies.judgementCrossing));
      expect(result.followingDistance).toEqual(true);
      expect(result.judgementCrossing).toEqual(true);
    });
  });

  describe('REMOVE_SERIOUS_FAULT', () => {
    it('should remove the competency from the state when a fault is removed', () => {
      const state: SeriousFaults = {
        controlsGears: true,
      };
      const result = seriousFaultsReducer(state, RemoveSeriousFault(Competencies.controlsGears));
      expect(result.controlsGears).toBeUndefined();
    });
  });

  describe('ADD_SERIOUS_FAULT_COMMENT', () => {
    it('should add a comment to the comptency', () => {
      const state: SeriousFaults = {};
      const result = seriousFaultsReducer(state, AddSeriousFaultComment(Competencies.controlsGears, 'Test'));
      expect(result.controlsGearsComments).toEqual('Test');
    });
  });
});

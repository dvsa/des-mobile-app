import { DangerousFaults } from '@dvsa/mes-test-schema/categories/common';
import { Competencies } from '../../../test-data.constants';
import { AddDangerousFault, AddDangerousFaultComment, RemoveDangerousFault } from '../dangerous-faults.actions';
import { dangerousFaultsReducer } from '../dangerous-faults.reducer';

describe('Dangerous Fault Reducer', () => {
  describe('ADD_DANGEROUS_FAULT', () => {
    it('should add a dangerous fault when none exist', () => {
      const state: DangerousFaults = {};
      const result = dangerousFaultsReducer(state, AddDangerousFault(Competencies.followingDistance));
      expect(result.followingDistance).toEqual(true);
    });
    it('should not remove an existing dangerous faults when a new one is added', () => {
      const state: DangerousFaults = {
        followingDistance: true,
      };
      const result = dangerousFaultsReducer(state, AddDangerousFault(Competencies.judgementCrossing));
      expect(result.followingDistance).toEqual(true);
      expect(result.judgementCrossing).toEqual(true);
    });
  });

  describe('REMOVE_DANGEROUS_FAULT', () => {
    it('should remove the competency from the state when a fault is removed', () => {
      const state: DangerousFaults = {
        controlsGears: true,
      };
      const result = dangerousFaultsReducer(state, RemoveDangerousFault(Competencies.controlsGears));
      expect(result.controlsGears).toBeUndefined();
    });
    it('should do nothing if there is not a dangerous fault for the comptency', () => {
      const state: DangerousFaults = {
        controlsGears: true,
      };
      const result = dangerousFaultsReducer(state, RemoveDangerousFault(Competencies.ancillaryControls));
      expect(result).toEqual(state);
    });
    it('should only remove the dangerous fault in the action', () => {
      const state: DangerousFaults = {
        followingDistance: true,
      };
      const result = dangerousFaultsReducer(state, RemoveDangerousFault(Competencies.judgementCrossing));
      expect(result.followingDistance).toEqual(true);
      expect(result.judgementCrossing).toBeUndefined();
    });
  });

  describe('ADD_DANGEROUS_FAULT_COMMENT', () => {
    it('should add the provided comment', () => {
      const state: DangerousFaults = {};
      const result = dangerousFaultsReducer(state, AddDangerousFaultComment(Competencies.ancillaryControls, 'Test'));
      expect(result.ancillaryControlsComments).toEqual('Test');
    });
  });
});

import { candidateCatHomeReducer } from '@store/tests/journal-data/cat-home/candidate/candidate.cat-home.reducer';
import * as candidateActions from '../candidate.cat-home.actions';

describe('candidateCatHomeReducer', () => {

  describe('PopulateCandidateDetailsCatHome', () => {
    it('should set pass certificate number to the value given', () => {
      const result = candidateCatHomeReducer(
        {}, candidateActions.PopulateCandidateDetailsCatHome({ driverNumber: 'test' }),
      );
      expect(result).toEqual({ driverNumber: 'test' });
    });
  });
});

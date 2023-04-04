import { candidateCatDReducer } from '@store/tests/journal-data/cat-d/candidate/candidate.cat-d.reducer';
import * as candidateActions from '../candidate.cat-d.actions';

describe('candidateCatDReducer', () => {

  describe('PopulateCandidateDetailsCatD', () => {
    it('should set pass certificate number to the value given', () => {
      const result = candidateCatDReducer(
        {}, candidateActions.PopulateCandidateDetailsCatD({ driverNumber: 'test' }),
      );
      expect(result).toEqual({ driverNumber: 'test' });
    });
  });
});

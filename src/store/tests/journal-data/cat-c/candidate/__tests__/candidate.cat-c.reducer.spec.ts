import { candidateCatCReducer } from '@store/tests/journal-data/cat-c/candidate/candidate.cat-c.reducer';
import * as candidateActions from '../candidate.cat-c.actions';

describe('candidateCatCReducer', () => {

  describe('PopulateCandidateDetailsCatC', () => {
    it('should set candidate to the value given', () => {
      const result = candidateCatCReducer(
        { candidateId: null }, candidateActions.PopulateCandidateDetailsCatC({ candidateId: 1 }),
      );
      expect(result).toEqual({ candidateId: 1 });
    });
  });
});

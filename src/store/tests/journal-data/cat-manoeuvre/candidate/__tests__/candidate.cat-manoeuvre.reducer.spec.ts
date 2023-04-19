import {
  candidateCatManoeuvreReducer,
} from '@store/tests/journal-data/cat-manoeuvre/candidate/candidate.cat-manoeuvre.reducer';
import * as candidateActions from '../candidate.cat-manoeuvre.actions';

describe('candidateCatManoeuvreReducer', () => {
  describe('PassCertificateNumberChanged', () => {
    it('should toggle the value passed when called', () => {
      const result = candidateCatManoeuvreReducer(
        { candidateId: 1 }, candidateActions.PopulateCandidateDetailsCatManoeuvre({ candidateId: 2 }),
      );
      expect(result).toEqual({ candidateId: 2 });
    });
  });
});

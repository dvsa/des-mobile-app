import { candidateReducer } from '../candidate.reducer';
import { PopulateCandidateDetails } from '../candidate.actions';
import { candidateMock } from '../../../../__mocks__/tests.mock';

describe('candidate reducer', () => {
  it('should return the candidate from a start test action', () => {
    const result = candidateReducer(null, PopulateCandidateDetails({ payload: candidateMock }));
    expect(result).toBe(candidateMock);
  });
});

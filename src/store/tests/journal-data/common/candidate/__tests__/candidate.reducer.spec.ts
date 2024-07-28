import { candidateMock } from '../../../../__mocks__/tests.mock';
import { PopulateCandidateDetails } from '../candidate.actions';
import { candidateReducer } from '../candidate.reducer';

describe('candidate reducer', () => {
	it('should return the candidate from a start test action', () => {
		const result = candidateReducer(null, PopulateCandidateDetails(candidateMock));
		expect(result).toBe(candidateMock);
	});
});

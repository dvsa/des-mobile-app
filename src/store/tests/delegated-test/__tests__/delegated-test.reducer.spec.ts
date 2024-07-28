import { StartDelegatedTest } from '../delegated-test.actions';
import { delegatedTestReducer } from '../delegated-test.reducer';

describe('delegatedTestReducer', () => {
	it('should return true if StartDelegatedTest action passed', () => {
		const result = delegatedTestReducer(null, StartDelegatedTest());
		expect(result).toBe(true);
	});
});

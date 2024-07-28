import { TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { PopulateTestCentre } from '../test-centre.actions';
import { testCentreReducer } from '../test-centre.reducer';

describe('testCentre reducer', () => {
	it('should return the testcentre from a populate test centre action', () => {
		const mockTestCentre: TestCentre = {
			centreId: 1,
			costCode: '1234',
		};
		const result = testCentreReducer(null, PopulateTestCentre(mockTestCentre));

		expect(result).toBe(mockTestCentre);
	});
});

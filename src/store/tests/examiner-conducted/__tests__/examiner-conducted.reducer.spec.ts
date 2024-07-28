import { SetExaminerConducted } from '../examiner-conducted.actions';
import { examinerConductedReducer } from '../examiner-conducted.reducer';

describe('examinerConductedReducer', () => {
	it('should return the correct value ', () => {
		const result = examinerConductedReducer(null, SetExaminerConducted(123456));
		expect(result).toBe(123456);
	});
});

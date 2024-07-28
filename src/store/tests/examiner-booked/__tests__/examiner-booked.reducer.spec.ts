import { SetExaminerBooked } from '../examiner-booked.actions';
import { examinerBookedReducer } from '../examiner-booked.reducer';

describe('examinerBookedReducer', () => {
	it('should return the correct value ', () => {
		const result = examinerBookedReducer(null, SetExaminerBooked(123456));
		expect(result).toBe(123456);
	});
});

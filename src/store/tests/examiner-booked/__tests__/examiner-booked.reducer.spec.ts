import { examinerBookedReducer } from '../examiner-booked.reducer';
import { SetExaminerBooked } from '../examiner-booked.actions';

describe('examinerBookedReducer', () => {
  it('should return the correct value ', () => {
    const result = examinerBookedReducer(null,  SetExaminerBooked({ payload: 123456 }));
    expect(result).toBe(123456);
  });
});

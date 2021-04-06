import { examinerConductedReducer } from '../examiner-conducted.reducer';
import { SetExaminerConducted } from '../examiner-conducted.actions';

describe('examinerConductedReducer', () => {
  it('should return the correct value ', () => {
    const result = examinerConductedReducer(null, SetExaminerConducted(123456));
    expect(result).toBe(123456);
  });
});

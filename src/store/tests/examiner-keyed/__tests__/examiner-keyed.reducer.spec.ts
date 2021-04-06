import { examinerKeyedReducer } from '../examiner-keyed.reducer';
import { SetExaminerKeyed } from '../examiner-keyed.actions';

describe('examinerKeyedReducer', () => {
  it('should return the correct value ', () => {
    const result = examinerKeyedReducer(null, SetExaminerKeyed(123456));
    expect(result).toBe(123456);
  });
});

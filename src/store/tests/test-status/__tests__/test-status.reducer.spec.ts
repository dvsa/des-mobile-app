import { testStatusReducer } from '../test-status.reducer';
import { TestStatus } from '../test-status.model';
import {
  SetTestStatusBooked,
  SetTestStatusStarted,
  SetTestStatusDecided,
  SetTestStatusCompleted,
  SetTestStatusSubmitted,
} from '../test-status.actions';

describe('test status reducer', () => {
  const slotId = '1003';
  const initialState = {
    [slotId]: '',
  };

  it('shoule move test status to booked when SetTestStatusBooked', () => {
    const result = testStatusReducer(initialState, SetTestStatusBooked({ payload: slotId }));
    expect(result[slotId]).toBe(TestStatus.Booked);
  });

  it('should move the test to started when receiving the SetTestStatusStarted action', () => {
    const result = testStatusReducer(initialState, SetTestStatusStarted({ payload: slotId }));
    expect(result[slotId]).toBe(TestStatus.Started);
  });

  it('should change the test to decided when receiving the TestStatusDecided action', () => {
    const result = testStatusReducer(initialState, SetTestStatusDecided({ payload: slotId }));
    expect(result[slotId]).toBe(TestStatus.Decided);
  });

  it('should change the test to completed when receiving the TestStatusCompleted action', () => {
    const result = testStatusReducer(initialState, SetTestStatusCompleted({ payload: slotId }));
    expect(result[slotId]).toBe(TestStatus.Completed);
  });

  it('should change the test to submitted when receiving the TestStatusSubmitted action', () => {
    const result = testStatusReducer(initialState, SetTestStatusSubmitted({ payload: slotId }));
    expect(result[slotId]).toBe(TestStatus.Submitted);
  });
});

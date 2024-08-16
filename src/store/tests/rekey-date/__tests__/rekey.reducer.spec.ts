import { SetRekeyDate } from '../rekey-date.actions';
import { rekeyDateReducer } from '../rekey-date.reducer';

describe('rekeyDateReducer', () => {
  it('should return a date', () => {
    const result = rekeyDateReducer(null, SetRekeyDate());
    expect(result).not.toBeNull();
  });
});

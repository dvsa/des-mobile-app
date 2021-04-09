import { rekeyDateReducer } from '../rekey-date.reducer';
import { SetRekeyDate } from '../rekey-date.actions';

describe('rekeyDateReducer', () => {
  it('should return a date', () => {
    const result = rekeyDateReducer(null, SetRekeyDate());
    expect(result).not.toBeNull();
  });
});

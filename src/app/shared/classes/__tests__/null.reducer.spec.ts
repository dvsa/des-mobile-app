import { nullReducer } from '../null.reducer';

describe('nullReducer', () => {
  it('should always return null', () => {
    expect(nullReducer({}, {})).toEqual(null);
  });
});

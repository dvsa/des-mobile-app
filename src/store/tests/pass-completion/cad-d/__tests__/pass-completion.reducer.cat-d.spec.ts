import { passCompletionCatDReducer } from '../pass-completion.cat-d.reducer';
import {
  Code78Present,
  Code78NotPresent,
} from '../../pass-completion.actions';

describe('pass completion reducer', () => {
  it('should put that the code 78 was present into the state when selected', () => {
    const result = passCompletionCatDReducer(null, Code78Present());
    expect(result.code78Present).toBe(true);
  });

  it('should put that the code 78 was not present into the state when not selected', () => {
    const result = passCompletionCatDReducer(null, Code78NotPresent());
    expect(result.code78Present).toBe(false);
  });

});

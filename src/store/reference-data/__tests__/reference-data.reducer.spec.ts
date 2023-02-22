import { initialState, referenceDataReducer } from '@store/reference-data/reference-data.reducer';
import { LoadTestCentresRefDataSuccess, SetDateRefDataUpdated } from '@store/reference-data/reference-data.actions';

describe('referenceDataReducer', () => {
  it('should update the value of dateLoaded', () => {
    const red = referenceDataReducer(initialState, SetDateRefDataUpdated('some date'));
    expect(red.dateLoaded).toEqual('some date');
  });
  it('should updated the value of testCentres', () => {
    const red = referenceDataReducer(initialState, LoadTestCentresRefDataSuccess({
      active: [],
      inactive: [],
    }));
    expect(red.testCentres).toEqual({ active: [], inactive: [] });
  });
});

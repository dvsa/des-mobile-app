import { SetChangeMarker } from '../change-marker.actions';
import { changeMarkerReducer } from '../change-marker.reducer';

describe('changeMarkerReducer', () => {
  it('should return the correct value ', () => {
    const result = changeMarkerReducer(null, SetChangeMarker({ payload: true }));
    expect(result).toBe(true);
  });
});

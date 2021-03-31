import { applicationReferenceReducer } from '../application-reference.reducer';
import { PopulateApplicationReference } from '../application-reference.actions';

describe('application reference reducer', () => {
  it('should return the application reference from a start test action', () => {
    const mockApplication = {
      applicationId: 1234567,
      bookingSequence: 8,
      checkDigit: 9,
    };
    const result = applicationReferenceReducer(null, PopulateApplicationReference({ payload: mockApplication }));

    expect(result).toEqual(mockApplication);
  });
});

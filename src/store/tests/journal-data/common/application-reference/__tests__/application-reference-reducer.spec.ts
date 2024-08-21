import { PopulateApplicationReference } from '../application-reference.actions';
import { applicationReferenceReducer } from '../application-reference.reducer';

describe('application reference reducer', () => {
  it('should return the application reference from a start test action', () => {
    const mockApplication = {
      applicationId: 1234567,
      bookingSequence: 8,
      checkDigit: 9,
    };
    const result = applicationReferenceReducer(null, PopulateApplicationReference(mockApplication));

    expect(result).toEqual(mockApplication);
  });
});

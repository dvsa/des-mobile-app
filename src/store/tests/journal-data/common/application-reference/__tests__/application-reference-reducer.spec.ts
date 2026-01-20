import { PopulateApplicationReference } from '../application-reference.actions';
import { applicationReferenceReducer } from '../application-reference.reducer';

describe('application reference reducer', () => {
  it('should return the application reference from a start test action', () => {
    const mockApplication = {
      applicationId: 1234567,
      bookingSequence: 8,
      checkDigit: 9,
      bookingReference: null,
    };
    const result = applicationReferenceReducer(null, PopulateApplicationReference(mockApplication));

    expect(result).toEqual(mockApplication);
  });
  it('should return the booking reference from a start test action', () => {
    const mockApplication = {
      applicationId: null,
      bookingSequence: null,
      checkDigit: null,
      bookingReference: 'AAAAAAAAAAAAA',
    };
    const result = applicationReferenceReducer(null, PopulateApplicationReference(mockApplication));

    expect(result).toEqual(mockApplication);
  });
});

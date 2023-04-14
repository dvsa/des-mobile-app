import { Candidate } from '@dvsa/mes-test-schema/categories/common';
import {
  getCandidateName,
  getCandidateDriverNumber,
  formatDriverNumber,
  getUntitledCandidateName,
  getPostalAddress,
  getCandidateId, getGenderFullDescription, getGender, getDateOfBirth, getGenderSilhouettePath,
} from '../candidate.selector';

describe('candidate selector', () => {
  const candidate: Candidate = {
    candidateName: {
      firstName: 'Joe',
      lastName: 'Bloggs',
      title: 'Mr',
    },
    gender: 'M',
    dateOfBirth: '11/11/1111',
    driverNumber: '123',
    candidateAddress: {
      addressLine1: '1 Example Street',
      addressLine2: '456 Market Square',
      addressLine3: 'Nottingham',
      addressLine4: 'East Midlands',
      addressLine5: 'United Kingdom',
      postcode: 'NG1 6HY',
    },
    candidateId: 1001,
  };

  const candidateNoTitle: Candidate = {
    candidateName: {
      firstName: 'Joe',
      lastName: 'Bloggs',
    },
    driverNumber: '123',
    candidateAddress: {
      addressLine1: '1 Example Street',
      addressLine2: '456 Market Square',
      addressLine3: 'Nottingham',
      addressLine4: 'East Midlands',
      addressLine5: 'United Kingdom',
      postcode: 'NG1 6HY',
    },
    candidateId: 1001,
  };
  describe('getCandidateName', () => {
    it('should produce first and last name with a title prefix', () => {
      expect(getCandidateName(candidate)).toBe('Mr Joe Bloggs');
    });

    it('should produce first and last name only when no title', () => {
      expect(getCandidateName(candidateNoTitle)).toBe('Joe Bloggs');
    });
    it('should return nothing if there is no name', () => {
      expect(getCandidateName({})).toBe('');
    });
  });

  describe('getGenderFullDescription', () => {
    it('should return "Female" if gender is set to "F"', () => {
      expect(getGenderFullDescription('F')).toEqual('Female');
    });
    it('should return "Male" if gender is not set to "F"', () => {
      expect(getGenderFullDescription('test')).toEqual('Male');
    });

    describe('getUntitledCandidateName', () => {
      it('should return nothing if there is no name', () => {
        expect(getUntitledCandidateName({})).toBe('');
      });

      it('should produce first and last name only, no title prefix', () => {
        expect(getUntitledCandidateName(candidate)).toBe('Joe Bloggs');
      });
    });

    describe('getCandidateDriverNumber', () => {
      it('should extract the driver number', () => {
        expect(getCandidateDriverNumber(candidate)).toBe('123');
      });
    });

    describe('formatDriverNumber', () => {
      it('should output the driver number as-is where it is not long enough', () => {
        expect(formatDriverNumber('123')).toBe('123');
      });
      it('should output the driver number in 3 space separated parts where applicable', () => {
        expect(formatDriverNumber('ABCDE123456Z78YX')).toBe('ABCDE 123456 Z78YX');
      });
    });

    describe('getPostalAddress', () => {
      it('should output the address', () => {
        expect(getPostalAddress(candidate)).toEqual(candidate.candidateAddress);
      });
    });

    describe('getGender', () => {
      it('should output gender', () => {
        expect(getGender(candidate)).toEqual(candidate.gender);
      });
    });

    describe('getGenderSilhouettePath', () => {
      it('should accurate silhouette if "F" is passed', () => {
        expect(getGenderSilhouettePath('F')).toEqual('assets/imgs/candidate-id/silhouette-2.png');
      });
      it('should accurate silhouette if "F" is not passed', () => {
        expect(getGenderSilhouettePath('test')).toEqual('assets/imgs/candidate-id/silhouette-1.png');
      });
    });

    describe('getDateOfBirth', () => {
      it('should output date of birth', () => {
        expect(getDateOfBirth(candidate)).toEqual(candidate.dateOfBirth);
      });
    });

    describe('getCandidateId', () => {
      it('should output the candidate ID', () => {
        expect(getCandidateId(candidate)).toEqual(1001);
      });
    });
  });
});

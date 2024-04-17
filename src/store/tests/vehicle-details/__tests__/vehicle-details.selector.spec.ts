import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import {
  getRegistrationNumber,
  getGearboxCategory,
  getMotStatus,
  getMotEvidenceProvided,
  getVehicleMake,
  getVehicleModel,
  getTestExpiryDate,
  getSearchedVRNList, getMotEvidence, isManual, isAutomatic,
} from '../vehicle-details.selector';

describe('vehicle details selector', () => {

  let state: VehicleDetails = {
    gearboxCategory: 'Manual',
    registrationNumber: '12AAA',
    motStatus: '13AAA',
    motEvidenceProvided: true,
    make: '14AAA',
    model: '15AAA',
    testExpiryDate: '16AAA',
    previouslySearchedRegNumbers: ['17AAA'],
    motEvidence: '18AAA',
  };

  beforeEach(() => {
    state = {
      gearboxCategory: 'Manual',
      registrationNumber: '12AAA',
      motStatus: '13AAA',
      motEvidenceProvided: true,
      make: '14AAA',
      model: '15AAA',
      testExpiryDate: '16AAA',
      previouslySearchedRegNumbers: ['17AAA'],
      motEvidence: '18AAA',
    };
  })

  describe('getRegistrationNumber', () => {
    it('should retrieve the registration number from the vehicle details', () => {
      expect(getRegistrationNumber(state)).toBe('12AAA');
    });
  });

  describe('getGearboxCategory', () => {
    it('should retrieve the gearbox category from the vehicle details', () => {
      expect(getGearboxCategory(state)).toBe('Manual');
    });
  });

  describe('getMotStatus', () => {
    it('should retrieve the mot status from the vehicle details', () => {
      expect(getMotStatus(state)).toBe('13AAA');
    });
  });

  describe('getMotEvidenceProvided', () => {
    it('should retrieve the mot evidence from the vehicle details', () => {
      expect(getMotEvidenceProvided(state)).toBe(true);
    });
  });

  describe('getVehicleMake', () => {
    it('should retrieve the vehicle make from the vehicle details', () => {
      expect(getVehicleMake(state)).toBe('14AAA');
    });
  });

  describe('getVehicleModel', () => {
    it('should retrieve the vehicle make from the vehicle details', () => {
      expect(getVehicleModel(state)).toBe('15AAA');
    });
  });

  describe('getTestExpiryDate', () => {
    it('should retrieve the expiry date from the vehicle details', () => {
      expect(getTestExpiryDate(state)).toBe('16AAA');
    });
  });

  describe('getSearchedVRNList', () => {
    it('should retrieve the searched vrn list from the vehicle details', () => {
      expect(getSearchedVRNList(state)).toEqual(['17AAA']);
    });
  });

  describe('getMotEvidence', () => {
    it('should retrieve the mot evidence from the vehicle details', () => {
      expect(getMotEvidence(state)).toBe('18AAA');
    });
  });

  describe('isManual', () => {
    it('should return true if the gearbox category is manual', () => {
      expect(isManual(state)).toBe(true);
    });
    it('should return false if the gearbox category is automatic', () => {
      state = {
        ...state,
        gearboxCategory: 'Automatic',
      }
      expect(isManual(state)).toBe(false);
    });
  });

  describe('isAutomatic', () => {
    it('should return false if the gearbox category is manual', () => {
      expect(isAutomatic(state)).toBe(false);
    });
    it('should return true if the gearbox category is automatic', () => {
      state = {
        ...state,
        gearboxCategory: 'Automatic',
      }
      expect(isAutomatic(state)).toBe(true);
    });
  });
});

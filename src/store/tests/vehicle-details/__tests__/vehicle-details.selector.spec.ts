import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import {
  getAlternativeMotEvidenceDetails,
  getAlternativeMotEvidenceProvided,
  getGearboxCategory,
  getMake,
  getModel,
  getRegistrationNumber,
  getTestExpiryDate,
} from '../vehicle-details.selector';

describe('VehicleDetailsSelector', () => {
  const state: VehicleDetails = {
    gearboxCategory: 'Manual',
    registrationNumber: '11AAA',
  };

  describe('getRegistrationNumber', () => {
    it('should retrieve the registration number from the vehicle details', () => {
      expect(getRegistrationNumber(state))
        .toBe('11AAA');
    });
  });

  describe('getGearboxCategory', () => {
    it('should retrieve the gearbox category from the vehicle details', () => {
      expect(getGearboxCategory(state))
        .toBe('Manual');
    });
  });
  describe('getMake', () => {
    it('should return the `make` property', () => {
      expect(getMake({
        ...state,
        make: 'Ford',
      }))
        .toEqual('Ford');
    });
  });
  describe('getModel', () => {
    it('should return the `model` property', () => {
      expect(getModel({
        ...state,
        model: 'Fiesta',
      }))
        .toEqual('Fiesta');
    });
  });
  describe('getTestExpiryDate', () => {
    it('should return the `testExpiryDate` property', () => {
      expect(getTestExpiryDate({
        ...state,
        testExpiryDate: '20/12/2023',
      }))
        .toEqual('20/12/2023');
    });
  });
  describe('getAlternativeMotEvidenceProvided', () => {
    it('should return the `motEvidenceProvided` property', () => {
      expect(getAlternativeMotEvidenceProvided({
        ...state,
        motEvidenceProvided: true,
      }))
        .toEqual(true);
    });
  });
  describe('getAlternativeMotEvidenceDetails', () => {
    it('should return the `motEvidence` property', () => {
      expect(getAlternativeMotEvidenceDetails({
        ...state,
        motEvidence: 'some evidence',
      }))
        .toEqual('some evidence');
    });
  });
});

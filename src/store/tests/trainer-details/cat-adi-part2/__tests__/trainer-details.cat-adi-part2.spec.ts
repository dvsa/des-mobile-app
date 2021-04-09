import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import {
  getOrditTrained,
  getTrainerRegistrationNumber,
  getTrainingRecords,
} from '../trainer-details.cat-adi-part2.selector';

describe('Trainer details Cat ADI PT2 selectors', () => {
  const state: CatADI2UniqueTypes.TrainerDetails = {
    orditTrainedCandidate: false,
    trainerRegistrationNumber: 23456,
    trainingRecords: true,
  };

  describe('getOrditTrained', () => {
    it('should retrieve the ordit trained from the trainer details', () => {
      expect(getOrditTrained(state)).toBe(false);
    });
  });
  describe('getTrainerRegistrationNumber', () => {
    it('should retrieve the trainer registration number', () => {
      expect(getTrainerRegistrationNumber(state)).toBe(23456);
    });
  });
  describe('getTrainingRecords', () => {
    it('should retrieve the training recorded', () => {
      expect(getTrainingRecords(state)).toBe(true);
    });
  });
});

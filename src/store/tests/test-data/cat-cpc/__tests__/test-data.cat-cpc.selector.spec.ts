import { TestData } from '@dvsa/mes-test-schema/categories/CPC';
import {
  getCombination,
  getQuestion1,
  getQuestion2,
  getQuestion3,
  getQuestion4,
  getQuestion5,
  getTotalPercent,
} from '../test-data.cat-cpc.selector';
import { question, question5 } from './test-data.cat-cpc.mock';

describe('CPC TestDataSelectors', () => {

  const state: TestData = {
    combination: 'LGV1',
    question1: question('3'),
    question2: question('8'),
    question3: question('2'),
    question4: question('6'),
    question5: question5(),
    totalPercent: 85,
  };

  describe('getCombination', () => {
    it('should return the value of the combination set', () => {
      expect(getCombination(state)).toEqual('LGV1');
    });
  });

  describe('getQuestion1', () => {
    it('should return the value of the code', () => {
      expect(getQuestion1(state).questionCode).toEqual('Q03');
    });
  });

  describe('getQuestion2', () => {
    it('should return the value of the code', () => {
      expect(getQuestion2(state).questionCode).toEqual('Q08');
    });
  });

  describe('getQuestion3', () => {
    it('should return the value of the code', () => {
      expect(getQuestion3(state).questionCode).toEqual('Q02');
    });
  });

  describe('getQuestion4', () => {
    it('should return the value of the code', () => {
      expect(getQuestion4(state).questionCode).toEqual('Q06');
    });
  });

  describe('getQuestion5', () => {
    it('should return the value of the code', () => {
      expect(getQuestion5(state).questionCode).toEqual('Q05');
    });
  });

  describe('getTotalPercent', () => {
    it('should return the value of the total percentage score of test', () => {
      expect(getTotalPercent(state)).toEqual(85);
    });
  });

});

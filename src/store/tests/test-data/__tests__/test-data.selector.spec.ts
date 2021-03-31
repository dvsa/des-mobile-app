import {
  getShowMeQuestionOptions,
} from '../common/test-data.selector';
import { OutcomeBehaviourMapProvider } from '../../../../providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from '../../../../pages/office/office-behaviour-map';
import { VehicleChecksQuestion } from '../../../../providers/question/vehicle-checks-question.model';

describe('TestDataSelectors', () => {
  describe('getShowMeQuestionOptions', () => {
    const outcomeBehaviourMapProvider = new OutcomeBehaviourMapProvider();
    outcomeBehaviourMapProvider.setBehaviourMap(behaviourMap);

    const showMeQuestions: VehicleChecksQuestion[] = [
      {
        code: 'S1',
        description: 'S1 Desc',
        shortName: 'S1 short',
      },
      {
        code: 'S2',
        description: 'S2 Desc',
        shortName: 'S2 short',
      },
      {
        code: 'N/A',
        description: 'Not applicable',
        shortName: 'Not applicable',
      },
    ];
    it('should return the list of questions without N/A if outcome field does not have showNotApplicable set', () => {
      const result = getShowMeQuestionOptions(showMeQuestions, '1', outcomeBehaviourMapProvider);
      expect(result.length).toBe(2);
      expect(result[0].code).toBe('S1');
      expect(result[1].code).toBe('S2');
    });
    it('should return extra question if outcome showNotApplicable set', () => {
      const result = getShowMeQuestionOptions(showMeQuestions, '4', outcomeBehaviourMapProvider);
      expect(result.length).toBe(3);
      expect(result[2].code).toBe('N/A');
    });

  });
});

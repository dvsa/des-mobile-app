import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';

export const NUMBER_OF_TELL_ME_QUESTIONS = 2;

// Questions can be long; we disable max-line-length lint rule to keep things clean.
/* eslint-disable max-len */
export const questions: VehicleChecksQuestion[] = [
  {
    code: 'Q3',
    description: 'Tell me the main safety factors involved in loading this vehicle.',
    shortName: 'Safety factors while loading',
  },
  {
    code: 'Q4',
    description: 'Tell me how you would check the condition of the reflectors on this vehicle.',
    shortName: 'Reflectors condition',
  },
  {
    code: 'Q5',
    description: 'Tell me how you would check the condition of the windscreen & windows on this vehicle.',
    shortName: 'Windscreen & windows condition',
  },
  {
    code: 'Q7',
    description: 'Tell me how you would check your tyres to ensure that they are correctly inflated, have sufficient tread depth and that their general condition is safe to use on the road.',
    shortName: 'Sufficient tread',
  },
  {
    code: 'Q8',
    description: 'Tell me how you would check the condition of the windscreen wipers on this vehicle.',
    shortName: 'Windscreen wipers condition',
  },
  {
    code: 'Q9',
    description: 'Tell me how you would check the condition of the body is safe on this vehicle.',
    shortName: 'Body safety',
  },
  {
    code: 'Q11',
    description: 'Identify where you would check the engine oil level and tell me how you would check that the engine has sufficient oil.',
    shortName: 'Engine has sufficient oil',
  },
  {
    code: 'Q14',
    description: 'Tell me how you would check the condition of the suspension on this vehicle.',
    shortName: 'Suspension condition',
  },
  {
    code: 'Q16',
    description: 'Identify where you would check the engine coolant level and tell me how you would check that the engine has the correct level.',
    shortName: 'Engine coolant',
  },
  {
    code: 'Q17',
    description: 'Tell me how you would check that the headlamps, sidelights & tail lights are working.',
    shortName: 'Headlamps, sidelights and tail lights',
  },
  {
    code: 'Q19',
    description: 'Tell me how you would operate the loading mechanism on this vehicle (vehicle specific ie tail lift).',
    shortName: 'Loading mechanism',
  },
  {
    code: 'Q22',
    description: 'Identify where the windscreen washer reservoir is and tell me how you would check the windscreen washer level.',
    shortName: 'Windscreen washer reservoir',
  },
];
/* eslint-enable max-len */

export default questions;

/* eslint-disable max-len */
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';

export const NUMBER_OF_TELL_ME_QUESTIONS = 1;

// Questions can be long; we disable max-line-length lint rule to keep things clean.
export const questions: VehicleChecksQuestion[] = [
  {
    code: 'E1',
    description: 'Tell me how you would check the condition of the body is safe on this vehicle.',
    shortName: 'Body condition',
  },
  {
    code: 'E3',
    description: 'Tell me how you would operate the loading mechanism on this vehicle (Vehicle specific. eg Tail Lift).',
    shortName: 'Loading mechanism',
  },
  {
    code: 'E5',
    description: 'Tell me how you would check the condition of the windscreen wipers on this vehicle.',
    shortName: 'Windscreen wipers condition',
  },
  {
    code: 'E7',
    description: 'Tell me how you would check the condition of the reflectors on this vehicle.',
    shortName: 'Reflectors condition',
  },
  {
    code: 'E9',
    description: 'Tell me how you would check the condition of the suspension on this vehicle.',
    shortName: 'Suspension condition',
  },
  {
    code: 'E11',
    description: 'Tell me the main safety factors involved in loading this vehicle.',
    shortName: 'Safety factors while loading ',
  },
];

export default questions;

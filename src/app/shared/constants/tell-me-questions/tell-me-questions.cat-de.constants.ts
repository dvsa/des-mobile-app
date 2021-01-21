/* eslint-disable max-len */
import { VehicleChecksQuestion } from '../../../providers/question/vehicle-checks-question.model';

export const NUMBER_OF_TELL_ME_QUESTIONS = 1;

export const questions: VehicleChecksQuestion[] = [
  {
    code: 'V30',
    description: 'Tell me how you would check the condition of the body is safe on this vehicle.',
    shortName: 'Body condition',
  },
  {
    code: 'V31',
    description: 'Tell me how you would check that the headlamps, sidelights & tail lights are working.',
    shortName: 'Headlamps, sidelights and tail lights',
  },
  {
    code: 'V32',
    description: 'Tell me how you would operate the kneeling suspension on this vehicle.',
    shortName: 'Kneeling mechanism',
  },
  {
    code: 'V34',
    description: 'Tell me how you would check the condition of the reflectors on this vehicle.',
    shortName: 'Reflectors condition',
  },
  {
    code: 'V35',
    description: 'Tell me the main safety factors involved in loading this vehicle.',
    shortName: 'Safety factors while loading',
  },
  {
    code: 'V36',
    description: 'Tell me how you would check the condition of the suspension on this vehicle.',
    shortName: 'Suspension condition',
  },
  {
    code: 'V37',
    description: 'Tell me how you would insert and remove the digital tachograph card (or disc) on this vehicle',
    shortName: 'Tacho card',
  },
  {
    code: 'V38',
    description: 'Tell me how you would check your tyres to ensure that they are correctly inflated, have sufficient tread depth and that their general condition is safe to use on the road.',
    shortName: 'Tyres',
  },
  {
    code: 'V39',
    description: 'Tell me how you would check the condition of the windscreen & windows on this vehicle.',
    shortName: 'Windscreen & windows condition',
  },
  {
    code: 'V40',
    description: 'Tell me how you would check the condition of the windscreen wipers on this vehicle.',
    shortName: 'Windscreen wipers condition',
  },
];

export default questions;

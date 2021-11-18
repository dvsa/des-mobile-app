/* eslint-disable max-len */
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';

export const NUMBER_OF_SHOW_ME_QUESTIONS = 1;
export const NUMBER_OF_SHOW_ME_QUESTIONS_EXTRA = 3;

// Questions can be long; we disable max-line-length lint rule to keep things clean.
export const questions: VehicleChecksQuestion[] = [
  {
    code: 'E2',
    description: 'Show me how you would replace the tachograph disc on this vehicle.',
    shortName: 'Change tacho',
  },
  {
    code: 'E4',
    description: 'Show me how you would check that the wheel nuts are secure on this vehicle.',
    shortName: 'Wheel nuts',

  },
  {
    code: 'E6',
    description: 'Show me how you would check that all doors including cargo doors are secure.',
    shortName: 'Doors security',

  },
  {
    code: 'E8',
    description: 'Show me how you would check the condition of the mudguards on this vehicle.',
    shortName: 'Mudguards condition',

  },
  {
    code: 'E10',
    description: 'Show me what instrument checks you would make before and after starting the engine on this vehicle.',
    shortName: 'Instrument checks',

  },
  {
    code: 'E12',
    description: 'Show me how you would check for air leaks on this vehicle.',
    shortName: 'Air leaks',
  },
  {
    code: 'E13',
    description: 'Show me how you would clean the windscreen using the windscreen washer and wipers.',
    shortName: 'Clean windscreen',
  },
  {
    code: 'E14',
    description: 'Show me how you would set the windscreen demister to clear the windows effectively.',
    shortName: 'Demist windscreen',
  },
  {
    code: 'E15',
    description: 'Show me how you would switch on the rear fog light(s) and explain when you would use it/them. (No need to exit vehicle)',
    shortName: 'Rear fog lights',
  },
  {
    code: 'E16',
    description: 'Show me how you switch your headlight from dipped to main beam. (No need to exit vehicle)',
    shortName: 'Dipped to main beam',
  },
  {
    code: 'E17',
    description: 'Show me how you would check that the brake lights are working on this vehicle. (I can assist you, if you need to switch the ignition on, please don’t start the engine)',
    shortName: 'Brake lights',
  },
];

export default questions;

/* eslint-disable max-len */
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';

export const NUMBER_OF_SHOW_ME_QUESTIONS = 1;

export const questions: VehicleChecksQuestion[] = [
  {
    code: 'V01',
    description: 'Show me how you would check for air leaks on this vehicle.',
    shortName: 'Air leaks',
  },
  {
    code: 'V02',
    description: 'Show me how you would check for the correct air pressure on this vehicle.',
    shortName: 'Air pressure',
  },
  {
    code: 'V03',
    description: 'Show me how you would check that all doors including cargo doors are secure.',
    shortName: 'All doors secure',
  },
  {
    code: 'V04',
    description: 'Show me how you would check that the brake lights are working on this vehicle (I can assist you, if you need to switch the ignition on, please don’t start the engine).',
    shortName: 'Brake lights',
  },
  {
    code: 'V05',
    description: 'Show me how you would check the operation (specify horn, warning device for reversing) of the audible warning devices on this vehicle.',
    shortName: 'Check audible warnings',
  },
  {
    code: 'V06',
    description: 'Show me how you would clean the windscreen using the windscreen washer and wipers.',
    shortName: 'Clean windscreen',
  },
  {
    code: 'V07',
    description: 'Show me how you would set the windscreen demister to clear the windows effectively.',
    shortName: 'Demist windscreen',
  },
  {
    code: 'V08',
    description: 'Show me how you switch your headlight from dipped to main beam. (No need to exit vehicle)',
    shortName: 'Dipped to main beam',
  },
  {
    code: 'V09',
    description: 'Show me how you would check that the direction indicators are working.',
    shortName: 'Direction indicators',
  },
  {
    code: 'V11',
    description: 'Identify where you would check the engine coolant level and tell me how you would check that the engine has the correct level.',
    shortName: 'Engine coolant',
  },
  {
    code: 'V12',
    description: 'Identify where you would check the engine oil level and tell me how you would check that the engine has sufficient oil',
    shortName: 'Engine has sufficient oil',
  },
  {
    code: 'V14',
    description: 'Show me where the first aid equipment is kept on this vehicle.',
    shortName: 'First aid equipment',
  },
  {
    code: 'V16',
    description: 'Show me what instrument checks you would make before and after starting the engine on this vehicle.',
    shortName: 'Instrument checks',
  },
  {
    code: 'V17',
    description: 'Show me how you would check the condition of the mudguards on this vehicle.',
    shortName: 'Mudguards condition',
  },
  {
    code: 'V18',
    description: 'Show me/explain how you would check that the power assisted steering is working.',
    shortName: 'Power assisted steering',
  },
  {
    code: 'V19',
    description: 'Show me how you would switch on the rear fog light(s) and explain when you would use it/them. (No need to exit vehicle)',
    shortName: 'Rear fog lights',
  },
  {
    code: 'V20',
    description: 'Show me how you would check the wheel nuts are secure on this vehicle.',
    shortName: 'Wheel nuts',
  },
  {
    code: 'V21',
    description: 'Identify where the windscreen washer reservoir is and tell me how you would check the windscreen washer level.',
    shortName: 'Windscreen washer',
  },
];

export default questions;

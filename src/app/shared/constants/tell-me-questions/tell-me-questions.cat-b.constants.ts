/* eslint-disable max-len */
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';

export const questions: VehicleChecksQuestion[] = [
  {
    code: 'T1',
    description: 'Tell me how you would check that the brakes are working before starting a journey.',
    shortName: 'Brakes',
  },
  {
    code: 'T2',
    description: 'Tell me where you would find the information for the recommended tyre pressures for this car and how tyre pressures should be checked.',
    shortName: 'Tyre pressures',
  },
  {
    code: 'T3',
    description: 'Tell me how you make sure your head restraint is correctly adjusted so it provides the best protection in the event of a crash.',
    shortName: 'Head restraint',
  },
  {
    code: 'T4',
    description: 'Tell me how you would check the tyres to ensure that they have sufficient tread depth and that their general condition is safe to use on the road.',
    shortName: 'Sufficient tread',
  },
  {
    code: 'T5',
    description: 'Tell me how you would check that the headlights & tail lights are working. (No need to exit vehicle)',
    shortName: 'Headlights & tail lights',
  },
  {
    code: 'T6',
    description: 'Tell me how you would know if there was a problem with your antilock braking system.',
    shortName: 'Antilock braking system',
  },
  {
    code: 'T7',
    description: 'Tell me how you would check the direction indicators are working. (No need to exit the vehicle)',
    shortName: 'Direction indicators',
  },
  {
    code: 'T8',
    description: 'Tell me how you would check the brake lights are working on this car.',
    shortName: 'Brake lights',
  },
  {
    code: 'T9',
    description: 'Tell me how you would check the power assisted steering is working before starting a journey.',
    shortName: 'Power assisted steering',
  },
  {
    code: 'T10',
    description: 'Tell me how you would switch on the rear fog light(s) and explain when you would use it/them, (no need to exit vehicle).',
    shortName: 'Rear fog light(s)',
  },
  {
    code: 'T11',
    description: 'Tell me how you switch your headlight from dipped to main beam and explain how you would know the main beam is on.',
    shortName: 'Dipped to main beam',
  },
  {
    code: 'T12',
    description: 'Open the bonnet and tell me how you would check that the engine has sufficient oil.',
    shortName: 'Engine has sufficient oil',
  },
  {
    code: 'T13',
    description: 'Open the bonnet and tell me how you would check that the engine has sufficient engine coolant.',
    shortName: 'Engine coolant',
  },
  {
    code: 'T14',
    description: 'Open the bonnet and tell me how you would check that you have a safe level of hydraulic brake fluid.',
    shortName: 'Brake fluid',
  },
];

export default questions;

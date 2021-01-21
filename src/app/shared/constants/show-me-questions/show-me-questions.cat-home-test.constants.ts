/* eslint-disable max-len */
import {
  VehicleChecksQuestion,
} from '../../../providers/question/vehicle-checks-question.model';

export const NUMBER_OF_SHOW_ME_QUESTIONS = 1;

export const questions: VehicleChecksQuestion[] = [
  {
    code: 'H1',
    description: 'Show me how you would check that the direction indicators are working.',
    shortName: 'Direction indicators',
  },
  {
    code: 'H2',
    description: 'Show me how you would check the brake lights are working on this vehicle, (if you need to switch the ignition on, please dont start the engine).',
    shortName: 'Brake lights',
  },
  {
    code: 'H3',
    description: 'Show me, or explain how you would check that the power assisted steering is working before starting a journey.',
    shortName: 'Power assisted steering',
  },
  {
    code: 'H4',
    description: 'Show me how you would check the parking brake (handbrake) for excessive wear; make sure you keep safe control of the vehicle.',
    shortName: 'Parking brake',
  },
  {
    code: 'H5',
    description: 'Show me how you would check that the horn is working.',
    shortName: 'Horn',
  },
  {
    code: 'H6',
    description: 'Show me how you would clean the windscreen using the windscreen washer and wipers.',
    shortName: 'Wash Windscreen',
  },
  {
    code: 'H7',
    description: 'Show me how you would switch on the rear fog light(s) and explain when you would use it/them, (no need to exit vehicle).',
    shortName: 'Rear fog lights',
  },
  {
    code: 'H8',
    description: 'Show me how you would switch your headlight on from dipped to main beam and explain how you would know the beam is on.',
    shortName: 'Dipped to main beam',
  },
  {
    code: 'H9',
    description: 'Show me how you would set the demister controls to clear all the windows effectively.',
    shortName: 'Demist windows',
  },
  {
    code: 'H10',
    description: 'Open the bonnet, identify where you would check the engine oil level and tell me how you would check that the engine has sufficient oil.',
    shortName: 'Engine oil',
  },
  {
    code: 'H11',
    description: 'Open the bonnet, identify where you would check the engine coolant level and tell me how you would check that the engine has the correct level.',
    shortName: 'Engine Coolant',
  },
  {
    code: 'H12',
    description: 'Open the bonnet, identify where the brake fluid reservoir is and tell me how you would check that you have a safe level of hydraulic brake fluid.',
    shortName: 'Brake Fluid',
  },
];

export default questions;

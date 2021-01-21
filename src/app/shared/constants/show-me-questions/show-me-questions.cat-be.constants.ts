/* eslint-disable max-len */
import { VehicleChecksQuestion } from '../../../providers/question/vehicle-checks-question.model';

export const NUMBER_OF_SHOW_ME_QUESTIONS = 3;

export const questions: VehicleChecksQuestion[] = [
  {
    code: 'E01',
    description: 'Open the bonnet and tell me how you would check that you have a safe level of hydraulic brake fluid, power steering fluid, engine oil or coolant (examiner to choose one)',
    shortName: 'Engine fluid levels',
  },
  {
    code: 'E02',
    description: 'Show me how you would check that the direction indicators are working.',
    shortName: 'Direction indicators',
  },
  {
    code: 'E03',
    description: 'Show me how you would check that your trailer doors are secure.',
    shortName: 'Trailer doors',
  },
  {
    code: 'E04',
    description: 'Show me how you would check the jockey wheel is correctly wound up and secure.',
    shortName: 'Jockey wheel',
  },
  {
    code: 'E05',
    description: 'Show me how you would check the condition of the trailer body',
    shortName: 'Body work',
  },
  {
    code: 'E06',
    description: 'Show me how you would check the trailer parking brake is in good working order',
    shortName: 'Trailer parking brake',
  },
  {
    code: 'E07',
    description: 'Show me how you would check the trailer wheel nuts are secure on this vehicle.',
    shortName: 'Wheel nuts',
  },
  {
    code: 'E08',
    description: 'Show me how you would check the breakaway cable before starting a journey and explain why it needs to be fixed to the vehicle',
    shortName: 'Breakaway cable',
  },
  {
    code: 'E09',
    description: 'Show me how you would adjust your headlights when you are towing a loaded trailer',
    shortName: 'Headlights',
  },
  {
    code: 'E10',
    description: 'Show me how you would check the condition of the electrical connections on the trailer',
    shortName: 'Electrical connections',
  },
];

export default questions;

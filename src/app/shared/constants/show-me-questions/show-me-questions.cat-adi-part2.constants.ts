import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';

export const NUMBER_OF_SHOW_ME_QUESTIONS = 2;

export const questions: VehicleChecksQuestion[] = [
  {
    code: 'A15',
    description: 'When it is safe to do so can you show me how you wash and clean the rear windscreen.',
    shortName: 'Rear windscreen',
  },
  {
    code: 'A16',
    description: 'When it is safe to do so can you show me how you wash and clean the front windscreen.',
    shortName: 'Front windscreen',

  },
  {
    code: 'A17',
    description: 'When it is safe to do so can you show me how you would switch on your dipped headlights',
    shortName: 'Dipped headlights',

  },
  {
    code: 'A18',
    description: 'When it is safe to do so can you show me how you would set the rear demister.',
    shortName: 'Rear demister',

  },
  {
    code: 'A19',
    description: 'When it is safe to do so can you show me how you would operate the horn.',
    shortName: 'Horn',
  },
  {
    code: 'A20',
    description: 'When it is safe to do so can you show me how you would demist the front windscreen.',
    shortName: 'Front demister',
  },
  {
    code: 'A21',
    description: 'When it is safe can you show me how you would open and close the side window.',
    shortName: 'Side window',
  },
  {
    code: 'A22',
    description: 'When it is safe to do so can you show me how you would operate the cruise control.',
    shortName: 'Cruise control',
  },
  {
    code: 'N/A',
    description: 'Not applicable.',
    shortName: 'Not applicable',
  },
];

export default questions;

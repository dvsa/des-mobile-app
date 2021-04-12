import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';

export const questions: VehicleChecksQuestion[] = [
  {
    code: 'S1',
    description: 'When it is safe to do so can you show me how you wash and clean the rear windscreen.',
    shortName: 'Rear windscreen',
  },
  {
    code: 'S2',
    description: 'When it is safe to do so can you show me how you wash and clean the front windscreen.',
    shortName: 'Front windscreen',

  },
  {
    code: 'S3',
    description: 'When it is safe to do so can you show me how you would switch on your dipped headlights',
    shortName: 'Dipped headlights',

  },
  {
    code: 'S4',
    description: 'When it is safe to do so can you show me how you would set the rear demister.',
    shortName: 'Rear demister',

  },
  {
    code: 'S5',
    description: 'When it is safe to do so can you show me how you would operate the horn.',
    shortName: 'Horn',
  },
  {
    code: 'S6',
    description: 'When it is safe to do so can you show me how you would demist the front windscreen.',
    shortName: 'Demist front windscreen',
  },
  {
    code: 'S7',
    description: 'When it is safe can you show me how you would open and close the side window.',
    shortName: 'Side window',
  },
  {
    code: 'N/A',
    description: 'Not applicable.',
    shortName: 'Not applicable',
  },
];

export default questions;

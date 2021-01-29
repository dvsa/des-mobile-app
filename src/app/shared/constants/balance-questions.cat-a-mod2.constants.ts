import { VehicleChecksQuestion } from '../../providers/question/vehicle-checks-question.model';

export const NUMBER_OF_BALANCE_QUESTIONS = 1;

export const questions: VehicleChecksQuestion[] = [
  {
    code: 'B1',
    description: 'What problems could arise from carrying a pillion passenger?',
    shortName: 'Pillion passenger problems',
  },
  {
    code: 'B2',
    description: 'How should a passenger be carried on the pillion seat?',
    shortName: 'Carrying a passenger',
  },
  {
    code: 'B3',
    description: 'How would the balance of the machine be affected if you carried a pillion passenger?',
    shortName: 'Balance with passenger',
  },
];

export default questions;

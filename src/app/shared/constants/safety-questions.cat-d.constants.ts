import { SafetyQuestion } from '../../providers/question/safety-question.model';

export const NUMBER_OF_SAFETY_QUESTIONS = 3;

export const questions: SafetyQuestion[] = [
  {
    description: 'Fire extinguisher',
  },
  {
    description: 'Emergency exit',
  },
  {
    description: 'Fuel cutoff',
  },
];

export default questions;

import { VehicleChecksQuestion } from '../../../providers/question/vehicle-checks-question.model';

export const NUMBER_OF_TELL_ME_QUESTIONS = 2;

export const questions : VehicleChecksQuestion[] = [
  {
    code: 'E20',
    description: 'Tell me how you would check your trailer is safely hitched to the towing vehicle.',
    shortName: 'Safely hitched',
  },
  {
    code: 'E21',
    description: 'Tell me where you would find the information on the maximum weight your vehicle can tow.',
    shortName: 'Max weight for towing',
  },
  {
    code: 'E22',
    description: 'Tell me the main safety factors involved in securing a load on this trailer.',
    shortName: 'Secure a load',
  },
  {
    code: 'E23',
    description: 'Tell me how you would check the condition of the tyres on this trailer.',
    shortName: 'Tyres',
  },
  {
    code: 'E24',
    description: 'Tell me the main safety factors involved in loading this vehicle.',
    shortName: 'Safe loading',
  },
];
/* tslint:enabl:max-line-length */

export default questions;

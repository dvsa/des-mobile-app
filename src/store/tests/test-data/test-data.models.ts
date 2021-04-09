import { Competencies } from './test-data.constants';

export type FaultPayload = {
  competency: Competencies,
  newFaultCount: number,
};

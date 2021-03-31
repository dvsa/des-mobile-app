import { ControlledStopUnion } from '../../../../../shared/unions/test-schema-unions';
import { get } from 'lodash';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';

export const isControlledStopSelected =
  (data: ControlledStopUnion): boolean => get(data, 'selected');

export const getControlledStopFault =
  (data: ControlledStopUnion): CompetencyOutcome => get(data , 'fault') as CompetencyOutcome;

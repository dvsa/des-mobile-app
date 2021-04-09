import { get } from 'lodash';
import { ControlledStopUnion } from '../../../../../app/shared/unions/test-schema-unions';
import { CompetencyOutcome } from '../../../../../app/shared/models/competency-outcome';

export const isControlledStopSelected = (
  data: ControlledStopUnion,
): boolean => get(data, 'selected');

export const getControlledStopFault = (
  data: ControlledStopUnion,
): CompetencyOutcome => get(data, 'fault') as CompetencyOutcome;

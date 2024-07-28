import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { ControlledStopUnion } from '@shared/unions/test-schema-unions';
import { get } from 'lodash-es';

export const isControlledStopSelected = (data: ControlledStopUnion): boolean => get(data, 'selected');

export const getControlledStopFault = (data: ControlledStopUnion): CompetencyOutcome =>
	get(data, 'fault') as CompetencyOutcome;

import { get } from 'lodash';
import { HighwayCodeSafetyUnion } from '../../../../../app/shared/unions/test-schema-unions';

export const isHighwayCodeSafetySelected = (
  data: HighwayCodeSafetyUnion,
): boolean => get(data, 'selected');

export const getHighwayCodeSafetyDrivingFault = (
  data: HighwayCodeSafetyUnion,
): boolean => get(data, 'drivingFault') as boolean;

export const getHighwayCodeSafetySeriousFault = (
  data: HighwayCodeSafetyUnion,
): boolean => get(data, 'seriousFault') as boolean;

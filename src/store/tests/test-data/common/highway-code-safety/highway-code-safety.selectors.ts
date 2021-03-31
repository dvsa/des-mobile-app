import { HighwayCodeSafetyUnion } from '../../../../../shared/unions/test-schema-unions';
import { get } from 'lodash';

export const isHighwayCodeSafetySelected =
  (data: HighwayCodeSafetyUnion): boolean => get(data, 'selected');

export const getHighwayCodeSafetyDrivingFault =
  (data: HighwayCodeSafetyUnion): boolean => get(data , 'drivingFault') as boolean;

export const getHighwayCodeSafetySeriousFault =
  (data: HighwayCodeSafetyUnion): boolean => get(data , 'seriousFault') as boolean;

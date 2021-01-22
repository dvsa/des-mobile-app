/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

export const ANALYTIC_RECORDED = '[Analytics] Analytic Recorded';
export const ANALYTIC_NOT_RECORDED = '[Analytics] Analytic Not Recorded';

export class AnalyticRecorded implements Action {
  readonly type = ANALYTIC_RECORDED;
}

export class AnalyticNotRecorded implements Action {
  readonly type = ANALYTIC_NOT_RECORDED;
}

export type Types =
  | AnalyticRecorded
  | AnalyticNotRecorded;

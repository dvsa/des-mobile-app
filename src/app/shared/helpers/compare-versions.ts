import { compare, CompareOperator } from 'compare-versions';

export const compareVersions = (
  v1: string,
  operator: CompareOperator,
  v2: string,
) => compare(v1, v2, operator);

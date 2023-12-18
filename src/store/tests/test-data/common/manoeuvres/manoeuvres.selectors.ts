import { get } from 'lodash-es';
import { ManoeuvreUnion } from '@shared/unions/test-schema-unions';

export const getReverseLeftSelected = (manoeuvres: ManoeuvreUnion) => {
  return get(manoeuvres, 'reverseLeft.selected', false);
};

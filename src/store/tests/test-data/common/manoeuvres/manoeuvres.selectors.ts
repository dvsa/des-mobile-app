import { ManoeuvreUnion } from '@shared/unions/test-schema-unions';
import { get } from 'lodash-es';

export const getReverseLeftSelected = (manoeuvres: ManoeuvreUnion) => {
	return get(manoeuvres, 'reverseLeft.selected', false);
};

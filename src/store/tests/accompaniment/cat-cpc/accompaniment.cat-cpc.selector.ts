import { Accompaniment } from '@dvsa/mes-test-schema/categories/CPC';

export const getSupervisorAccompaniment = (accompaniment: Accompaniment) => accompaniment.supervisor;

export const getInterpreterAccompaniment = (accompaniment: Accompaniment) => accompaniment.interpreter;

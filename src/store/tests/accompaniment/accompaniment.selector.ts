import { Accompaniment } from '@dvsa/mes-test-schema/categories/common';

export const getInstructorAccompaniment = (accompaniment: Accompaniment) => accompaniment.ADI;
export const getSupervisorAccompaniment = (accompaniment: Accompaniment) => accompaniment.supervisor;
export const getOtherAccompaniment = (accompaniment: Accompaniment) => accompaniment.other;
export const getInterpreterAccompaniment = (accompaniment: Accompaniment) => accompaniment.interpreter;

import { Accompaniment } from '@dvsa/mes-test-schema/categories/common';
import { createSelector } from '@ngrx/store';
import { selectAccompaniment } from '@store/tests/accompaniment/accompaniment.reducer';

export const getInstructorAccompaniment = (accompaniment: Accompaniment) => accompaniment.ADI;
export const selectInstructorAccompaniment = createSelector(
  selectAccompaniment,
  ({ ADI }) => ADI,
);
export const getSupervisorAccompaniment = (accompaniment: Accompaniment) => accompaniment.supervisor;
export const selectSupervisorAccompaniment = createSelector(
  selectAccompaniment,
  ({ supervisor }) => supervisor,
);
export const getOtherAccompaniment = (accompaniment: Accompaniment) => accompaniment.other;
export const selectOtherAccompaniment = createSelector(
  selectAccompaniment,
  ({ other }) => other,
);
export const getInterpreterAccompaniment = (accompaniment: Accompaniment) => accompaniment.interpreter;
export const selectInterpreterAccompaniment = createSelector(
  selectAccompaniment,
  ({ interpreter }) => interpreter,
);

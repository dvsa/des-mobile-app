import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { createSelector } from '@ngrx/store';
import {
  selectApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';

export const getApplicationNumber = (
  applicationReference: ApplicationReference,
): string => formatApplicationReference(applicationReference);

export const selectApplicationNumber = createSelector(
  selectApplicationReference,
  (appRef) => formatApplicationReference(appRef),
);

import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { getFormattedApplicationReference } from '@shared/helpers/formatters';

export const getApplicationNumber = (applicationReference: ApplicationReference): string =>
  getFormattedApplicationReference(applicationReference);

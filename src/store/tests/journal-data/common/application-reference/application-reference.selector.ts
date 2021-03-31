import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { formatApplicationReference } from '../../../../../app/shared/helpers/formatters';

export const getApplicationNumber = (
  applicationReference: ApplicationReference,
): string => formatApplicationReference(applicationReference);

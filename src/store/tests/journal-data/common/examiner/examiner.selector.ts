import { Examiner } from '@dvsa/mes-test-schema/categories/common';

export const getStaffNumber = (examiner: Examiner) => examiner.staffNumber || '';

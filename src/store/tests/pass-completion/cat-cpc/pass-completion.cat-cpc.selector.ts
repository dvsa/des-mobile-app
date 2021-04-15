import { PassCompletion } from '@dvsa/mes-test-schema/categories/CPC';

export const getPassCertificateNumber = (passCompletion: PassCompletion) => passCompletion.passCertificateNumber;

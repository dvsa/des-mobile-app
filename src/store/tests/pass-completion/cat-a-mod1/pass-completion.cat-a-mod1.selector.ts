import { PassCompletion } from '@dvsa/mes-test-schema/categories/AM1';

export const getPassCertificateNumber = (
  passCompletion: PassCompletion,
  ) => passCompletion.passCertificateNumber;

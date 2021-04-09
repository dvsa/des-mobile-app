import { PassCompletion } from '@dvsa/mes-test-schema/categories/common';

export const getPassCertificateNumber = (
  passCompletion: PassCompletion,
): string => passCompletion.passCertificateNumber;

export const isProvisionalLicenseProvided = (
  passCompletion: PassCompletion,
): boolean => passCompletion.provisionalLicenceProvided;

export const isProvisionalLicenseNotProvided = (
  passCompletion: PassCompletion,
): boolean => passCompletion.provisionalLicenceProvided !== null && !passCompletion.provisionalLicenceProvided;

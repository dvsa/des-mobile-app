import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';

export const getManoeuvrePassCertificateNumber = (
  decs: CatDUniqueTypes.PreTestDeclarations,
): string => decs.manoeuvrePassCertificateNumber;

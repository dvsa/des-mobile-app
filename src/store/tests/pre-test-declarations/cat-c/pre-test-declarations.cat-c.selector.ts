import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';

export const getManoeuvrePassCertificateNumber = (
  decs: CatCUniqueTypes.PreTestDeclarations,
): string => decs.manoeuvrePassCertificateNumber;

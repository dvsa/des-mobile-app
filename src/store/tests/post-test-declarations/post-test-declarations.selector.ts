import { PostTestDeclarations } from '@dvsa/mes-test-schema/categories/common';

export const getHealthDeclarationStatus = (decs: PostTestDeclarations) => decs.healthDeclarationAccepted;
export const getReceiptDeclarationStatus = (decs: PostTestDeclarations) => decs.passCertificateNumberReceived;
export const getSignatureStatus = (decs: PostTestDeclarations) => decs.postTestSignature;
